'use strict'


var http = new XMLHttpRequest();
var httpDel = new XMLHttpRequest();
var  url, urlD;
var enableToRead = true;
var res;
var loc = window.location.href;
var c = 0;

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
var param = loc.substr(loc.indexOf("=")+1, loc.length);

if(param.includes("#")){
    param = param.substr(0, param.indexOf("#"));
}

if(lc.includes("localhost")){
    url = `http://localhost:8080/find/${param}`;
    urlD = 'http://localhost:8080/del';
}else{
    url = `http://${lc}:8080/find/${param}`;
    urlD = `http://${lc}:8080/del`;
}
var elems = document.querySelectorAll('.modal');
var instances = M.Modal.init(elems, ({
    onCloseStart: function(){
        enableToRead = true;
    }
}));

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
var title = document.getElementById("title");
var byType = [];
var resp;
//Env
var w;
var max
var gC1;
var gC2;
var gC3;
setGrid();
title.innerHTML = `Buscar: ${param}`;
maxim.innerHTML = `En este espacio se mostraran los datos coincidentes con ${param}`;
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
    }
    if(w > 600 && w < 800){
        gC1 = 3;
        gC2 = 2;
        gC3 = 2;
        max = 10;
    }
    if(w <= 600){
        gC1 = 1;
        gC2 = 2;
        gC3 = 2;
        max = 11;
    }
}

window.onresize = function(event) {
  setGrid();
};



sendHTTP("");

function sendHTTP(msg){
    http.open('GET', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function() {
        if(http.readyState == 4) {
            getRes(JSON.parse(http.responseText));
            resp = JSON.parse(http.responseText);
        }else{
            notFound();
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
                window.location.href = urlD.substr(0, urlD.indexOfLast("/"));
            }, 1000);
         
        }
    }
    httpDel.send(`picture=${msg}`);
}

function notFound(){
   var h1 =  document.createElement("h3");
   var p =  document.createElement("p");
   var divider = document.createElement("div");
   divider.classList.add("divider");
   h1.setAttribute("id", "notFound");
   p.innerHTML = `Revisa si los valores de busqueda son los correctos, o es posible que el elemento ${param} no exista en el inventario.`
    h1.innerHTML = `No se encontro ningun elemento :'v`;
    h1.appendChild(divider);
    h1.appendChild(p);
    mainS.appendChild(h1);
}

function getRes (data){

    mainS.innerHTML = "";

    var containF = document.createElement("div");
    var containS = document.createElement("div");
    var containT = document.createElement("div");
    var containFo = document.createElement("div");
    var groups;

    containF.classList.add("container");
    containS.classList.add("container");
    containT.classList.add("container");
    containFo.classList.add("container");

    containF.setAttribute("id", "firsTCt");
    containS.setAttribute("id", "secondTCt");
    containT.setAttribute("id", "thirdTCt");
    containFo.setAttribute("id", "fourTCt");

    for(var i = 0 ; i < data.length; i++){
        byType.push(data[i].type.toUpperCase());
    }
    
    groups = groupBy(byType);
    for(var i = 0 ; i < groups.length; i++){

        for(var e = 0 ; e < data.length; e++){
            if(data[e].type.toUpperCase() == groups[i][1] ){
                var thisEl = data[e];
                break;
            }
        }
            var poper = document.createElement("i");
            var item = document.createElement("div");
            var image = document.createElement("img");
            //Add Classes
            item.classList.add("item");
            image.classList.add("imgPd");
            poper.classList.add("poper");
            poper.classList.add("z-depth-2");
            //Set attr
            poper.innerHTML = groups[i][0];
            image.setAttribute("src", thisEl.picture);
            //Append
            item.appendChild(image);
            if(groups[i][0] != 1){
                item.appendChild(poper);
            }

            image.addEventListener('click', (e) =>{
                e = e || window.event;
                var target = e.target || e.srcElement;
                var pos = thisElement(data, target.getAttribute("src"));

                enableToRead = false;
                modelo.innerHTML = data[pos].model.toUpperCase();
                serial.innerHTML = data[pos].serial.toUpperCase();
                tipo.innerHTML = data[pos].type.toUpperCase();
                marca.innerHTML = data[pos].brand.toUpperCase();
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
    mainS.appendChild(containF);
    mainS.appendChild(containS);
    mainS.appendChild(containT);
    mainS.appendChild(containFo);
    console.log(byType)
    console.log(groupBy(byType));

}
//tools
function numberOf(arry){

   var st = new Set(arry);
   var es = [...st];
   var arryS = [];
   var count = 0;

    for(var e = 0; e < es.length;e++) {
        for(var i = 0; i < arry.length;i++) {
            if( arry[i] == es[e]){
                count++;
            }
        }
        arryS[e] = [count, es[e]];
        count = 0;
    }
   
    return arryS;
}

function thisElement(arry, src){
    for(var i = 0; i < arry.length;i++){
        if(arry[i].picture == src){
            return i;
        }
    }
}

function groupBy(arry){
    var n =  numberOf(arry);
    return n;
}


//Events
infoS.addEventListener("dblclick", (e) =>{
    e = e || window.event;
    var target = e.target || e.srcElement;

    window.open(target.getAttribute("src"));
})

exitInfo.addEventListener("click", () =>{
    infoModel.style.opacity = 0;
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
