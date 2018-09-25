const {app, BrowserWindow, ipcMain, Menu} = require('electron');
const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const appServe = express();
const mongoose = require('mongoose');
const Product = require('./models/product');
const UsersD = require('./models/users');
const Upload = require('express-fileupload');
const fs = require('fs');
var mvComplete = false;
var sse;
let win;
var port = process.env.port || 8080;
const {spawn} = require('child_process');


if(process.platform == "win32"){
    const mongo = spawn('cmd.exe', ['/c', 'mongo.bat']);
}else{
    const mongod = spawn('mongod');
    const mongo = spawn('mongo');
}


function createWindow(){
    win = new BrowserWindow({
        minWidth : 996,
        minHeight : 640,
        height: 640, 
        width : 1024,
        titleBarStyle : 'hidden',
        frame : true, 
        resizable: true,
        backgroundColor : "#ffffff",
        fullscreenable : true,
        icon: path.join(__dirname, 'src/assets/build/Windows/icon.ico')
    });
    win.loadURL(`http://localhost:${port}`);
    win.on('closed', () =>{
        win == null;
        app.quit();
    })
}
app.on('window-all-closed', () =>{
    if(process.platform !== "darwin"){
        app.quit();
    }
})

app.on('ready', () =>{
    setTimeout(() => {
        createWindow();
    }, 3000);
});

app.on('activate', () =>{
    if(win == true){
        createWindow();
    }
})


//Add Users


//Init Server
appServe.use(Upload());
appServe.use( express.static( __dirname + 'public' ));
appServe.use(express.static(path.join(__dirname + '/src')));
appServe.use(bodyparser.urlencoded({extended : false}));
appServe.use(bodyparser.json());

// Send resources
appServe.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/src'));
});

// Send resources
appServe.post('/user/',function(req,res){
    let user = new UsersD();
    user.name = req.body.name
    user.pass = req.body.pass;
    user.perm = req.body.perm;
    user.save( (err) =>{
        if(err) throw err;
        else res.send("Success");
    });
});
appServe.post("/validate", (req, res) =>{
    let nameD = req.body.name;
    let passD = req.body.pass;

    UsersD.find({name: nameD}, (err, docs)=>{
        if(err) throw err;
        else if(docs != ""){
            if(docs[0].pass == passD){
                res.send(docs[0].perm);
            }else{
                res.send("wrong password");
            }
        }else{
            res.send("not found");
        }
    })
});

appServe.get("/showUsers", (req, res) =>{
    UsersD.find({}, (err, us) =>{
        if(err) return res.status(500).send("Error al buscar");
        if(!us){
            res.status(404).send("No existe");
        }
        res.send(us);
    });
})
appServe.get("/deleteUsers", (req, res) =>{
    UsersD.remove({}, function(err) {
        if (err) {
            console.log(err)
        } else {
            res.end('success');
        }
    });
})


//Show all data
appServe.get('/show',function(req,res){
    Product.find({}, (err, product) =>{
        if(err) return res.status(500).send("Error al buscar");
        if(!product){
            res.status(404).send("No existe");
        }
        res.send(product);
     }).sort({'_id': -1});
});

//Find by Model

appServe.get('/find/:pid', (req, res) =>{
    var c = 0;
    let pid = req.params.pid;

    function findByModel(){
        Product.find({model: pid}, function (err, docs) {
            if(err) throw err;

            if(docs.length < 1){
                findBySerial();
            }else{
                res.send(docs);
            }
        }).sort({'_id': 1});
    }
    function findBySerial(){
        Product.find({serial: pid}, function (err, docs) {
            if(err) throw err;

            if(docs.length < 1){
                findByType();
            }else{
                res.send(docs);
            }
        }).sort({'_id': 1});
    }
    function findByType(){
        Product.find({type: pid}, function (err, docs) {
            if(err) throw err;
            if(docs.length < 1){
                findByBrand();
            }else{
                res.send(docs);
            }
        }).sort({'_id': 1});
    }
    function findByBrand(){
        Product.find({brand: pid}, function (err, docs) {
            if(err) throw err;
            if(docs.length < 1){
                findByPrice();
            }else{
                res.send(docs);
            }
        }).sort({'_id': 1});
    }
    function findByPrice(){
        Product.find({price: pid+"Q"}, function (err, docs) {
            if(err) throw err;
            if(docs.length < 1){
                res.status(500).send("");
            }else{
                res.send(docs);
            }
        }).sort({'_id': 1});
    }
    findByModel();
});





//Remove
appServe.get('/delete', (req, res) =>{
    Product.remove({}, function(err) {
        if (err) {
            console.log(err)
        } else {
            res.end('success');
        }
    });
});

appServe.delete('/del', (req, res) =>{
    let pid = req.body.picture;
    Product.findOneAndRemove({picture : "."+pid}, function(err){
        if(err) throw err;
        res.send("success");
        fs.unlink(__dirname+"/src"+pid, (err) => {
            if (err) throw err;
          });
    })
})

appServe.put('/update', (req, res) =>{
    var today = new Date();
    var fullDateS = `${getCurrentDay(today)} ${fullDate(today)} a las ${getHoursHalf(today)}`;
    let pid = req.body.picture;
    Product.findOneAndUpdate({picture : "."+pid}, {
        $set:{
            model: req.body.model,
            serial: req.body.serial,
            type: req.body.type,
            brand: req.body.brand,
            comment: req.body.comment,
            price: req.body.price,
            date: fullDateS
        }}, {new: true} , function(err){if(err) throw err;else res.send("success")});
})

//Save Data
appServe.post('/file', (req, res) =>{
    if(req.files){       
        var file = req.files.filename,
            filename = file.name;
        file.mv(__dirname+"/src/data/"+filename, (err) =>{
            if(err){
                throw err;
            }else{
                mvComplete = true;
            }
        })   
    }
})

appServe.post('/', (req, res) =>{
    let product = new Product();
    
    var today = new Date();
    var fullDateS = `${getCurrentDay(today)} ${fullDate(today)} a las ${getHoursHalf(today)}`;

    product.picture = "./data/"+req.body.picture;
    product.model = req.body.model;
    product.serial = req.body.serial;
    product.type = req.body.type;
    product.brand = req.body.brand;
    product.comment = req.body.comment;
    product.price = req.body.price+"Q";
    product.date = fullDateS;

    product.save( (err, productStored) =>{
        if(err) throw err;
        sse = setInterval(() =>{
            if(mvComplete){
                res.send(productStored);
                clearInterval(sse);
            }
        }, 100); 
    });
})

//Search by tag



//Remove


mongoose.connect('mongodb://localhost:27017/ei', (err, res) =>{
    if(err) throw err
    appServe.listen(port, () =>{
        console.log(`http://localhost:${port}`);
    });
});


//Menu
function createMenu(){
    var menu = Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
                {label:'About EI-Inventario'},
                {
                    role : "toggledevtools",
                    label : "Developer Tools",
                    accelerator : "Ctrl+I",
                },
                {
                    role : "reload",
                    label : "Reload",
                    accelerator : "CmdOrCtrl+R"
                },
                {type : "separator"},
                { 
                    label:'Exit',
                    click(){
                        app.quit();
                    },
                    accelerator : "CmdOrCtrl+Q"
                }
            ],
        }
    ])
    Menu.setApplicationMenu(menu);
}

//Tools
function getCurrentDay(day){
    var td = day.getDay();
    if(td == 0){
        return "domingo";
    }else if(td == 1){
        return "lunes";
    }else if( td == 2){
        return "martes";
    }else if(td == 3){
        return "miercoles";
    }else if(td == 4){
        return "jueves";
    }else if(td == 5){
        return "viernes";
    }else if(td == 6){
        return "sabado";
    }
}

function getHoursHalf(time){
    var hour = time.getHours();
    return `${hour}:${time.getMinutes()}:${time.getSeconds()} hrs`;
}

function fullDate(day){
    var year = day.getFullYear();
    var month = day.getMonth();
    var day = day.getDate();
    return `${day}/${month}/${year}`;
}
