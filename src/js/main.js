'use strict'


var http = new XMLHttpRequest();

var url;
var loc = window.location.href;


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
    url = 'http://localhost:8080/';
}else{
    url = `http://${lc}:8080/`;
}


var params;
var paramsFile;

http.open('POST', url, true);
//Elements

var form = document.querySelectorAll(".input-field");
var titleBar = document.getElementById("titleBar");
var navbar = document.querySelector(".navbar");
var piece = document.querySelector(".materialboxed");
var pieceDiv = document.getElementById("piece");
var imgSrc = document.getElementById("imgSrc");
var floatBtn = document.querySelector(".fixed-action-btn");
var btnS = document.getElementById("btnSend");
var menuBtn = document.querySelector(".sidenav-trigger");
var progress = document.querySelector(".progress");
var c = 0;

var pieceOffset = piece.offsetHeight;
var h = window.innerHeight;
var w = window.innerWidth;
var elems = document.querySelectorAll('.materialboxed');
var enableOpen = true;


//Inputs;
var model = document.getElementById("model");
var serial = document.getElementById("serial");
var brand = document.getElementById("brand");
var types = document.getElementById("type");
var comment = document.getElementById("comment");
var price = document.getElementById("price");

function empty(){
    model.value = "";
    serial.value = "";
    brand.value = "";
    types.value = "";
    comment.value = "";
    price.value = "";
}
empty();


//Init image

var instances = M.Materialbox.init(elems, {
    onOpenEnd:function(){
        for(var i =0; i < form.length; i++){
            form[i].classList.add("openImg");
        }
        var tp = document.getElementById("type").value;
        var model = document.getElementById("model").value;
        var caption = document.querySelector(".materialbox-caption");
        caption.innerHTML = tp+" "+model;
        document.body.style.overflowY = "hidden";
       
    },
    onOpenStart:function(){
        navbar.style.zIndex = "1";
        titleBar.classList.add("openImg");
        navbar.classList.add("openImg");
        pieceDiv.style.background = "none";
        floatBtn.style.zIndex = 1;
        floatBtn.classList.add("openImg");
        var drag = document.querySelector('.drag-target');
        drag.style.zIndex = "0";
        menuBtn.style.zIndex = "0";
    },
    onCloseStart:function(){
        for(var i =0; i < form.length; i++){
            form[i].classList.remove("openImg");
        }
        document.body.style.overflowY = "scroll";
        navbar.style.zIndex = "2";
        titleBar.classList.remove("openImg");
        navbar.classList.remove("openImg");
        piece.classList.remove("center");
        floatBtn.style.zIndex = 10;
        floatBtn.classList.remove("openImg");
        var drag = document.querySelector('.drag-target');
        drag.style.zIndex = "1";
        menuBtn.style.zIndex = "2";
    },
})


//Events
var remote = document.querySelector(".remote");

remote.addEventListener("click", () =>{
    alert(`Bienvenido a EI Inventario si desea hacer una consulta remota Conectarse a http://${urlP}:8080/`);
})



document.querySelector(".save").addEventListener("click", () =>{
c++;
if(c == 1){

    var file = document.getElementById("imgSrc");
    var picture = document.getElementById("imgSrc").value;
    model = document.getElementById("model").value;
    serial = document.getElementById("serial").value;
    brand = document.getElementById("brand").value;
    types = document.getElementById("type").value;
    comment = document.getElementById("comment").value;
    price = document.getElementById("price").value;
    var ps = picture.substr(12, picture.length);

    if((ps.length * picture.length * model.length * serial.length * brand.length * types.length * price.length) != 0){
        paramsFile = file.files[0];
        params = `picture=${ps}&model=${model.toLowerCase()}&serial=${serial.toLowerCase()}&type=${types.toLowerCase()}&brand=${brand.toLowerCase()}&comment=${comment}&price=${price}`;
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        btnS.click();
        http.send(params);
        progress.style.display = "block";
        M.toast({html: 'Enviado producto espere por favor ...'});
    }else{
        c = 0;
        M.toast({html: 'Error 001: Falta llenar campos.'});
    }
           
    http.onreadystatechange = function() {
        if(http.readyState == 4) {
            progress.style.display = "none";
            M.toast({html: 'Producto guardado con exito.'});
            setTimeout(() => {
                location.reload();
            }, 1000);
         }   
    }
}
})


pieceDiv.addEventListener("click", ()=>{    
    if(enableOpen){
        imgSrc.click();
    }
});

imgSrc.addEventListener("change", () =>{
    pieceDiv.style.background = "none";
    enableOpen = false;
    readURL(imgSrc);
    setTimeout(() => {
        var iH = piece.clientHeight;
        var iW = piece.clientWidth;
        
        if( iW > iH){
            piece.classList.add("cH");
        }
        if(iH > iW){
            piece.classList.add("cW");
        }
    }, 500);

});

//tools

String.prototype.indexOfLast = function (str){
    for(var i = 0;i < this.length;i++){
        if( this.charAt(this.length - i) == str ){
            return this.length-i;
        }
    }
}

function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        piece.classList.add("openS");
        piece.setAttribute("src",e.target.result);
      }
      reader.readAsDataURL(input.files[0]);
    }
  }