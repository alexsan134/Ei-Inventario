'use strict'


var http = new XMLHttpRequest();
var httpDel = new XMLHttpRequest();
var  url, urlD;
var enableToRead = true;
var res;
var c;
var loc = window.location.href;
var timeReload;

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
}else{
    url = `http://${lc}:8080/show`;
    urlD = `http://${lc}:8080/del`;
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
var infoModel = document.getElementById("infoModel");
var infoS = document.getElementById("infoS");
var retire = document.getElementById("retire");

var resp;
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
                alert(`Bienvenido a EI Inventario si desea hacer una consulta remota Conectarse a http://${urlP}:8080/`);
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
    httpDel.open('POST', urlD, true);
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

                enableToRead = false;
                modelo.innerHTML = data[pos].model;
                serial.innerHTML = data[pos].serial;
                tipo.innerHTML = data[pos].type;
                marca.innerHTML = data[pos].brand;
                comentario.innerHTML = data[pos].comment;
                price.innerHTML = data[pos].price;
                dates.innerHTML = data[pos].date;
                picture.setAttribute("src", target.getAttribute("src"));
                infoModel.style.display = "block";
                setTimeout(() =>{
                    infoModel.style.opacity = 1;
                }, 50);
                c = 0;
     
            })

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




exitInfo.addEventListener("click", () =>{
    infoModel.style.opacity = 0;
    enableToRead = true;
    setTimeout(() => {
        infoModel.style.display = "none";
    }, 400);
})




retire.addEventListener("click", () =>{
    c++;
    if(c == 1){
        var pic = picture.getAttribute("src").toString().substr(1, picture.getAttribute("src").length - 1);
        retirePr(pic);
    }
})

//Parallax

//Responsive Grid


//Alerts


///Message
var today = new Date();
var fullDateS = `${getCurrentDay(today)} ${fullDate(today)} a las ${getHoursHalf(today)}`;
console.log(`Platform: ${process.platform}\n\nCurrent Path: ${__dirname}\n\nTime: ${fullDateS}`);
