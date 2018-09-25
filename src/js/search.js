'use strict'


var http = new XMLHttpRequest();
var httpDel = new XMLHttpRequest();
var user = new XMLHttpRequest();
var  url, urlD, urlU, urlUser;
var enableToRead = true;
var res;
var loc = window.location.href;
var c = 0;
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
var param = loc.substr(loc.indexOf("=")+1, loc.length);

if(param.includes("#")){
    param = param.substr(0, param.indexOf("#"));
}

if(lc.includes("localhost")){
    url = `http://localhost:8080/find/${param}`;
    urlD = 'http://localhost:8080/del';
    urlU = 'http://localhost:8080/update';
    urlUser = 'http://localhost:8080/validate';
}else{
    url = `http://${lc}:8080/find/${param}`;
    urlD = `http://${lc}:8080/del`;
    urlU = `http://${lc}:8080/update`;
    urlUser = 'http://${lc}:8080/validate';
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
var editMenu = document.getElementById("editMenu");
var eModel = document.getElementById("eModel");
var eSerial = document.getElementById("eSerial");
var etipo = document.getElementById("etipo");
var eMarca = document.getElementById("eMarca");
var ePrice = document.getElementById("ePrice");
var eComment = document.getElementById("eComment");
var updateE = document.getElementById('updateE');
var editBtn = document.getElementById("editBtn");
var exitEdit = document.getElementById("exitEdit");
var editModel = document.getElementById("editModel");
var menus = document.querySelector(".collection");
var editBtn = document.getElementById("editBtn");
var ttInfo = document.getElementById("ttInfo");
var login = document.getElementById("login");
var names = document.getElementById("names");
var pass = document.getElementById("password");
var byType = [];
var showVersion = document.querySelectorAll(".showVersion");
var resp;
var exitLogin = document.getElementById("exitLogin");
var userBox = document.querySelector(".userBox");
var nVal, passVal;
var loginMode;
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
    httpDel.open('DELETE', urlD, true);
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
    mainS.appendChild(containF);
    mainS.appendChild(containS);
    mainS.appendChild(containT);
    mainS.appendChild(containFo);
    console.log(byType)
    console.log(groupBy(byType));

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

function groupBy(arry){
    var n =  numberOf(arry);
    return n;
}


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
editBtn.addEventListener("click", () =>{
    setEdit();
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



infoMenu.addEventListener("click", () =>{
    if(menuTarget){
        infoModel.style.display = "block";
        setTimeout(() =>{
            infoModel.style.opacity = 1;
        }, 50);
    }else{
       window.location.reload();
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



imgMenu.addEventListener("click", () =>{
    if(menuTarget){
        window.open(picture.getAttribute("src"));
    }else{
        showSearchBox();
    }
})



editMenu.addEventListener("click", () =>{
    if(menuTarget){
        setEdit();
    }else{
        window.close();
    }
})

updateE.addEventListener("click", () =>{
    c++;
    if(c == 1){
        var pic = picture.getAttribute("src").toString().substr(1, picture.getAttribute("src").length - 1);
        updatePr(pic);
    }
})