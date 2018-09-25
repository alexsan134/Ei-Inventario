'use strict'


var http = new XMLHttpRequest();
var httpDel = new XMLHttpRequest();
var user = new XMLHttpRequest();
var  url, urlD, urlU, urlUser;
var enableToRead = true;
var res;
var c;
var loc = window.location.href;
var timeReload;
var menuTarget = false;

//Elements
//Protos
String.prototype.indexOfLast = function (str){
    for(var i = 0;i < this.length;i++){
        if( this.charAt(this.length - i) == str ){
            return this.length-i;
        }
    }
}
var lc = loc.substr(loc.indexOf("/")+2, loc.indexOfLast(":") -7);

if(lc.includes("localhost")){
    url = 'http://localhost:8080/show';
    urlD = 'http://localhost:8080/del';
    urlU = 'http://localhost:8080/update';
    urlUser = 'http://localhost:8080/validate';
}else{
    url = `http://${lc}:8080/show`;
    urlD = `http://${lc}:8080/del`;
    urlU = `http://${lc}:8080/update`;
    urlUser = `http://${lc}:8080/validate`;
}

var mainS = document.getElementById("mainS");
var maxim = document.getElementById("maxim");
var modelo = document.getElementById("modelo");
var serial = document.getElementById("serial");
var tipo = document.getElementById("tipo");
var marca = document.getElementById("marca");
var comentario = document.getElementById("comment");
var price = document.getElementById("price");
var picture = document.getElementById("infoS");
var dates = document.getElementById("date");
var upBtn = document.querySelector(".upBtn");
var exitInfo = document.getElementById("exitInfo");
var exitLogin = document.getElementById("exitLogin");
var exitEdit = document.getElementById("exitEdit");
var infoModel = document.getElementById("infoModel");
var editModel = document.getElementById("editModel");
var infoS = document.getElementById("infoS");
var retire = document.getElementById("retire");
var menus = document.querySelector(".collection");
var infoMenu = document.getElementById("infoMenu");
var imgMenu = document.getElementById("imgMenu");
var removeMenu = document.getElementById("removeMenu");
var editMenu = document.getElementById("editMenu");
var eModel = document.getElementById("eModel");
var eSerial = document.getElementById("eSerial");
var etipo = document.getElementById("etipo");
var eMarca = document.getElementById("eMarca");
var ePrice = document.getElementById("ePrice");
var eComment = document.getElementById("eComment");
var updateE = document.getElementById('updateE');
var editBtn = document.getElementById("editBtn");
var ttInfo = document.getElementById("ttInfo");
var showVersion = document.querySelectorAll(".showVersion");
var login = document.getElementById("login");
var names = document.getElementById("names");
var pass = document.getElementById("password");
var userBox = document.querySelector(".userBox");
var nVal, passVal;
var loginMode;
var resp;
var respws;
showVersion[0].addEventListener("click", ()=>{
    alert("Electrónica Internacional - Inventario\nEs un producto desarrollado por:\nAlexSantos© 2018 todos los derechos reservados.")
})
showVersion[1].addEventListener("click", ()=>{
    alert("Electrónica Internacional - Inventario\nEs un producto desarrollado por:\nAlexSantos© 2018 todos los derechos reservados.")
})

//Env
var w;
var max
var gC1;
var gC2;
var gC3;
setGrid();

maxim.innerHTML = `En este espacio se mostraran solo los ${max} productos mas recientes`;
function setGrid(){
    w = window.innerWidth;
    if(w < 990){
        if(navigator.appVersion.includes("Android")){
            upBtn.innerHTML = '<i class="material-icons">wifi</i>Conectado a EI';
        }else{
            upBtn.classList.add("waves-effect");
            upBtn.addEventListener("click", () =>{
                alert(`Bienvenido a EI Inventario\nsi desea hacer una consulta remota\nConectarse a http://${urlP}:8080/`);
            })
            upBtn.innerHTML = '<i class="material-icons">wifi</i>Conexión Remota';
        }
    }
    if(w >= 800){
        gC1 = 4;
        gC2 = 2;
        gC3 = 3;
        max = 12;
          timeReload = 5000;
    }
    if(w > 600 && w < 800){
        gC1 = 3;
        gC2 = 2;
        gC3 = 2;
        max = 10;
          timeReload = 60000;
    }
    if(w <= 600){
        gC1 = 1;
        gC2 = 2;
        timeReload = 60000;
        gC3 = 2;
        max = 11;
    }
}

window.onresize = function(event) {
  setGrid();
  getRes(resp);
};



sendHTTP("");

function sendHTTP(msg){
    http.open('GET', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function() {
        if(http.readyState == 4) {
           getRes(JSON.parse(http.responseText));
           resp = JSON.parse(http.responseText);
        }
    }
    http.send(msg);
}
function retirePr(msg){
    httpDel.open('DELETE', urlD, true);
    httpDel.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    httpDel.onreadystatechange = function() {
        if(http.readyState == 4) {
            setTimeout(() => {
                location.reload();
            }, 1000);
         
        }
    }
    httpDel.send(`picture=${msg}`);
}

function updatePr(msg){
    httpDel.open('PUT', urlU, true);
    httpDel.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    httpDel.onreadystatechange = function() {
        if(http.readyState == 4) {
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    }
    httpDel.send(`picture=${msg}&model=${eModel.value.toLowerCase()}&serial=${eSerial.value.toLowerCase()}&type=${etipo.value.toLowerCase()}&brand=${eMarca.value.toLowerCase()}&comment=${eComment.value}&price=${ePrice.value+"Q"}`);
}

function validate(name, pass){
    user.open('POST', urlUser, true);
    user.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    user.onreadystatechange = function() {
        if(user.readyState == 4) {
            respws = user.responseText;
        }
    }
    user.send(`name=${name}&pass=${pass}`);
}

setInterval(() =>{
    if(enableToRead){
        sendHTTP("");
    }
}, timeReload);

function getRes (data){

    mainS.innerHTML = "";

    var containF = document.createElement("div");
    var containS = document.createElement("div");
    var containT = document.createElement("div");
    var containFo = document.createElement("div");

    containF.classList.add("container");
    containS.classList.add("container");
    containT.classList.add("container");
    containFo.classList.add("container");

    containF.setAttribute("id", "firsTCt");
    containS.setAttribute("id", "secondTCt");
    containT.setAttribute("id", "thirdTCt");
    containFo.setAttribute("id", "fourTCt");
    
    if(data.length < max){
        max = data.length;
    }

    if(data != ""){
        for(var i = 0 ; i < max; i++){
            if(data[i]){
            var thisEl = data[i];

            var item = document.createElement("div");
            var image = document.createElement("img");
            
            //Add Classes
            item.classList.add("item");
            image.classList.add("imgPd");

            //Set attr
            image.setAttribute("src", thisEl.picture);

            //Append
            item.appendChild(image);

            image.addEventListener('click', (e) =>{
                enableToRead = false;
                e = e || window.event;
                var target = e.target || e.srcElement;
                var pos = thisElement(data, target.getAttribute("src"));
                setInfo(pos, data, target);
                infoModel.style.display = "block";
                setTimeout(() =>{
                    infoModel.style.opacity = 1;
                }, 50);
            })
            image.addEventListener('contextmenu', (e) =>{
                enableToRead = false;
                e = e || window.event;
                var target = e.target || e.srcElement;
                var pos = thisElement(data, target.getAttribute("src"));
                setInfo(pos, data, target);
                setTimeout(() =>{
                    menuTarget = true;
                    infoMenu.innerHTML = '<li><i class="material-icons">info</i>Información</li>';
                    imgMenu.innerHTML = '<li><i class="material-icons">image</i>Abrir imagen</li>';
                    removeMenu.innerHTML = '<li><i class="material-icons">shopping_cart</i>Retirar producto</li>';
                    editMenu.innerHTML = '<li><i class="material-icons">edit</i>Editar</li>';
                }, 10);
            });

            if(i >= (gC2+gC1+gC3)){
                containFo.appendChild(item);
            }

            if(i >= (gC2+gC1) && i < (gC2+gC1+gC3)){
                containT.appendChild(item);
            }
            if(i >= gC1 && i < (gC2+gC1)){
                containS.appendChild(item);
            }
            if(i < gC1){
                containF.appendChild(item);
            }
    
        }
    }
    }

    mainS.appendChild(containF);
    mainS.appendChild(containS);
    mainS.appendChild(containT);
    mainS.appendChild(containFo);
    // console.log(data["0"]._doc.picture);
}
//tools

function thisElement(arry, src){
    for(var i = 0; i < arry.length;i++){
        if(arry[i].picture == src){
            return i;
        }
    }
}
names.addEventListener("keyup", () =>{
    nVal = names.value;
})
pass.addEventListener("keyup", () =>{
    passVal = pass.value;
})

login.addEventListener("click", () =>{
    validate(nVal, passVal);

    if(loginMode == "edit"){
    if(respws == "admin"){
        var userBox = document.querySelector(".userBox");
        userBox.style.display = "none";
    }

    }else{
        if(respws == "admin" || respws == "mod"){
            var userBox = document.querySelector(".userBox");
            userBox.style.display = "none";
            var pic = picture.getAttribute("src").toString().substr(1, picture.getAttribute("src").length - 1);
            retirePr(pic);
        }
    }
})

function setEdit(){
    loginMode = "edit";
    enableToRead = false;
    userBox.style.display = "block";
    setTimeout(() => {
        userBox.style.opacity = 1;  
    }, 100);
    nVal = "";
    passVal = "";
    names.value = "";
    pass.value = "";
    respws = "";  

    editModel.style.display = "block";
    setTimeout(() => {
        editModel.style.opacity = 1;
    }, 100);
    eModel.value = modelo.textContent;
    eSerial.value = serial.textContent;
    etipo.value = tipo.textContent;
    eMarca.value = marca.textContent;
    if(comentario.textContent == ""){
        eComment.value = "No hay comentario";
    }else{
        eComment.value = comentario.textContent;
    }
    ePrice.value = price.textContent.substr(0,price.textContent.length -1) ;
}

function setInfo(pos, data, target){
    modelo.innerHTML = data[pos].model;
    serial.innerHTML = data[pos].serial;
    tipo.innerHTML = data[pos].type;
    marca.innerHTML = data[pos].brand;
    comentario.innerHTML = data[pos].comment;
    price.innerHTML = data[pos].price;
    dates.innerHTML = data[pos].date;
    picture.setAttribute("src", target.getAttribute("src"));
    c = 0;
}


function getCurrentDay(day){
    var td = day.getDay();
    if(td == 0){
        return "Domingo";
    }else if(td == 1){
        return "Lunes";
    }else if( td == 2){
        return "Martes";
    }else if(td == 3){
        return "Miercoles";
    }else if(td == 4){
        return "Jueves";
    }else if(td == 5){
        return "Viernes";
    }else if(td == 6){
        return "Sabado";
    }
}

function getHoursHalf(time){
    var hour = time.getHours();
    var pmOram;
    if(hour < 12){
        pmOram = "a.m";
    }else {
        pmOram = "p.m";
    } 
    return `${hour}:${time.getMinutes()}:${time.getSeconds()} ${pmOram}`;
}

function fullDate(day){
    var year = day.getFullYear();
    var month = day.getMonth();
    var day = day.getDate();

    return `${day}/${month}/${year}`;
}


//Events
infoS.addEventListener("dblclick", (e) =>{
    e = e || window.event;
    var target = e.target || e.srcElement;
    window.open(target.getAttribute("src"));
})

document.addEventListener("click", () =>{
    menus.style.opacity = 0;
    setTimeout(() => {
        menus.style.display = "none";
    }, 300);
})

function contextMenu(e){
    menuTarget = false;
    menus.style.display = "none";
    infoMenu.innerHTML = '<li><i class="material-icons">loop</i>Recargar</li>';
    imgMenu.innerHTML = '<li><i class="material-icons">search</i>Buscar</li>';
    removeMenu.innerHTML = '<li><i class="material-icons">attachment</i>Ingresar producto</li>';
    editMenu.innerHTML = '<li><i class="material-icons">exit_to_app</i>Salir</li>';
    
    var x = e.clientX;
    var y = e.clientY;
    
    if( x > (window.innerWidth - 200) ){
        x = e.clientX - 190;
    }
    if( y > (window.innerHeight - 220) ){
        y = e.clientY - 220;
    }
    menus.style.top = y+"px";
    menus.style.left = x+"px";
    setTimeout(() => {
        menus.style.display = "block";
        setTimeout(() => {
            menus.style.opacity = 1;
        }, 10);
    }, 10);
}
document.oncontextmenu = function(e){
    contextMenu(e);
};
if(w > 600){
    editBtn.addEventListener("mouseover", () =>{
        editBtn.style.opacity = 1;
    })
    editBtn.addEventListener("mouseout", () =>{
        editBtn.style.opacity = 0;
    });
    ttInfo.addEventListener("mouseover", () =>{
        editBtn.style.opacity = 1;
    })
    ttInfo.addEventListener("mouseout", () =>{
        editBtn.style.opacity = 0;
    });
}

exitInfo.addEventListener("click", () =>{
    infoModel.style.opacity = 0;
    enableToRead = true;
    setTimeout(() => {
        infoModel.style.display = "none";
    }, 400);
})
exitEdit.addEventListener("click", () =>{
    editModel.style.opacity = 0;
    enableToRead = true;
    setTimeout(() => {
        editModel.style.display = "none";
    }, 400);
})
exitLogin.addEventListener("click", () =>{
    enableToRead = true;
    editModel.style.opacity = 0;
    setTimeout(() => {
        editModel.style.display = "none";
    }, 400);
    userBox.style.opacity = 0;
    setTimeout(() => {
        userBox.style.display = "none";
    }, 400);
})
editBtn.addEventListener("click", () =>{
    setEdit();
})



infoMenu.addEventListener("click", () =>{
    if(menuTarget){
        infoModel.style.display = "block";
        setTimeout(() =>{
            infoModel.style.opacity = 1;
        }, 50);
    }else{
        sendHTTP("");
        getRes(resp);
    }
})

imgMenu.addEventListener("click", () =>{
    if(menuTarget){
        window.open(picture.getAttribute("src"));
    }else{
        showSearchBox();
    }
})

removeMenu.addEventListener("click", () =>{
    if(menuTarget){
        loginMode = "retire";
        userBox.style.display = "block";
        setTimeout(() => {
            userBox.style.opacity = 1;
        }, 100);
    }else{
        window.location.href = "./insert.html";
    }
})

editMenu.addEventListener("click", () =>{
    if(menuTarget){
        setEdit();
    }else{
        window.close();
    }
})

retire.addEventListener("click", () =>{
    c++;
    if(c == 1){
        loginMode = "retire";
        userBox.style.display = "block";
        setTimeout(() => {
            userBox.style.opacity = 1;
        }, 100);
    }
})
updateE.addEventListener("click", () =>{
    c++;
    if(c == 1){
        var pic = picture.getAttribute("src").toString().substr(1, picture.getAttribute("src").length - 1);
        updatePr(pic);
    }
})

//Parallax

//Responsive Grid


//Alerts


///Message
var today = new Date();
var fullDateS = `${getCurrentDay(today)} ${fullDate(today)} a las ${getHoursHalf(today)}`;
console.log(`Platform: ${process.platform}\n\nCurrent Path: ${__dirname}\n\nTime: ${fullDateS}`);
