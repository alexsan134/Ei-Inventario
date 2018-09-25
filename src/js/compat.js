var sidenav = document.querySelectorAll('.sidenav');
var instances = M.Sidenav.init(sidenav);

var searchBox = document.getElementById("searchBox");
var searchBtn = document.getElementById("searchBtn");
var exitSearch = document.getElementById("exitSearch");
var actSearch = document.querySelectorAll(".actSearch");
var headers = document.getElementById("header");
var search = document.getElementById("search");
var lblSearch = document.getElementById("lblSearch");
var searchBtn = document.getElementById("searchBtn");
var paramValue;
var urlP, urls;

getIP((ip) =>{
    urlP = ip;
});

String.prototype.indexOfLast = function (str){
    for(var i = 0;i < this.length;i++){
        if( this.charAt(this.length - i) == str ){
            return this.length-i;
        }
    }
}
var loc = window.location.href;
var lc = loc.substr(loc.indexOf("/")+2, loc.indexOfLast(":") -7);
if(lc.includes("localhost")){
    urls = `http://localhost:8080/search.html?search=`;
}else{
    urls = `http://${lc}:8080/search.html?search=`;
}

function showSearchBox(){
    searchBox.style.display = "block";
    search.focus();
    setTimeout(() =>{
        searchBox.style.opacity = 1;
    },  100);
}

//Events
exitSearch.addEventListener("click", () =>{
    searchBox.style.opacity = 0;
    setTimeout(() => {
        searchBox.style.display = "none";
    }, 300);
})
actSearch[0].addEventListener("click", () =>{
    showSearchBox();
})
actSearch[1].addEventListener("click", () =>{
    showSearchBox();
})

search.addEventListener("keypress", (k) =>{
    if(k.key == "Enter"){
        window.location.href = urls+(search.value).toLowerCase();
    }
})
searchBtn.addEventListener("click", () =>{
    window.location.href = urls+(search.value).toLowerCase();
})



var remote = document.querySelector(".remote");

remote.addEventListener("click", () =>{
    alert(`Bienvenido a EI Inventario\nsi desea hacer una consulta remota\nConectarse a http://${urlP}:8080/`);
})
if(includesHeader){
window.addEventListener("scroll", () =>{
    var scrollX = window.scrollY;
    var mp, vp;
    if(w <= 600){
        mp = 0;
        vp = 0;
    }else if(w >= 1024){
        mp = 0.4;
        vp = 300;
    }
    
    headers.style.backgroundPosition = "0 -"+(vp+(scrollX*mp))+"px";
})
}

//tools
function getIP(onNewIp){
    var peerConection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new peerConection({
         iceServers : []
    })
    var noop = function () {};
    var localIPs = {};
    var ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,1}){7})/g;
    var key;

    function iterateIP(ip){
        if(!localIPs[ip]) onNewIp(ip);
        localIPs = true;
    }
    pc.createDataChannel("");

    pc.createOffer().then(function(sdp){
        sdp.sdp.split("\n").forEach(function(line){
            if(line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        })
        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function(reason){
        console.log(reason);  
    })

    pc.onicecandidate = function(ice){
        if(!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    }
}