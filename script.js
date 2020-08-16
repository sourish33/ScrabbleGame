
//These prevent spurious webpages from opening by dragging
var boosters = {};
(boosters = function fillBoosters() {
boosters["a1"]=boosters["a8"]=boosters["a15"]=boosters["h1"]=boosters["h15"]="TW";
boosters["o1"]=boosters["o8"]=boosters["o15"]="TW";
boosters["a4"]=boosters["a12"]="DL";
boosters["c8"]=boosters["c10"]="DL";
boosters["d1"]=boosters["d8"]=boosters["d15"]="DL";
boosters["g3"]=boosters["g7"]=boosters["g9"]=boosters["g13"]="DL";
boosters["h4"]=boosters["h12"]="DL";
boosters["i3"]=boosters["i7"]=boosters["i9"]=boosters["i13"]="DL";
boosters["11"]=boosters["l8"]=boosters["l15"]="DL";
boosters["m7"]=boosters["m9"]="DL";
boosters["o3"]=boosters["o12"]="DL";
boosters["b6"]=boosters["b12"]="TL";
boosters["f2"]=boosters["f6"]=boosters["f10"]=boosters["f13"]="TL";
boosters["j2"]=boosters["j6"]=boosters["j10"]=boosters["j13"]="TL";
boosters["m6"]=boosters["m12"]="TL";
boosters["b2"]=boosters["b14"]="DL";
boosters["c3"]=boosters["c13"]="DL";
boosters["d4"]=boosters["d12"]="DL";
boosters["e5"]=boosters["e11"]="DL";
boosters["k5"]=boosters["k11"]="DL";
boosters["l4"]=boosters["l12"]="DL";
boosters["m3"]=boosters["m13"]="DL";
boosters["n2"]=boosters["n14"]="DL";
boosters["h8"]="&bigstar;";
})();

var tilesArray;
(tilesArray = function makeTileList(){

    tilesArray=[];
    specs = [
    [9, "A", 1], 
    [12, "E", 1], 
    [9, "I", 1], 
    [8, "O", 1],
    [6,"N", 1],
    [6,"R", 1],
    [6,"T", 1],
    [4,"L",1],
    [4,"S",1],
    [4,"U",1],
    [4,"D",2],
    [3,"G",2],
    [2,"B",3],
    [2,"C",3],
    [2,"M",3],
    [2,"P",3],
    [2,"F",4],
    [2,"H",4],
    [2,"V",4],
    [2,"W",4],
    [2,"Y",4],
    [1,"K",5],
    [1,"J",8],
    [1,"X",8],
    [1,"Q",10],
    [1,"Z",10],
    [2,"_", 0]
    ];
    let count = 1;
    for (x of specs) { 
        for (let i=0;i<x[0];i++){ 
            newlist = [count,x[1], x[2].toString()];
            tilesArray.push(newlist);
            count++;
        }
    }

})();


window.addEventListener("dragover",function(e){
e = e || event;
e.preventDefault();
},false);
window.addEventListener("drop",function(e){
e = e || event;
e.preventDefault();
},false);

// document.getElementById("replenish").addEventListener("click", replenishRack());


function onDragStart(event) {
    event
        .dataTransfer
        .setData('text/plain', event.target.id);
    }

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {
    let incoming = event.dataTransfer.getData('text');
    let destination = event.target.id;
    let u = document.getElementById(incoming);
    if (u==null) {return;}//to prevent the error "cannot read parentelement of null"
    origin = u.parentElement.id;
    move(origin,destination);
    // event.dataTransfer.clearData();
}


function includes(strToCheck, word) {	
    return (word.indexOf(strToCheck) > -1 ? true : false)
}



function getLettersOnSquare(whichSquare){
    u = boosters[whichSquare];
    return (u!=null ? u : "");
}

function move(fromWhere, toWhere) {
    let origin = document.getElementById(fromWhere);
    let destination = document.getElementById(toWhere);
    if (origin===destination){return;}
    if (origin==null || destination==null) {return;}
    let tile = origin.getElementsByTagName('div')[0];
    let tileAlreadyThere = destination.getElementsByTagName('div')[0];

    if (tileAlreadyThere != null) { 
        if (tileAlreadyThere.classList.contains("ghost"))
        //going back to the rack, a ghost tile should be discarded
            {
                destination.removeChild(tileAlreadyThere);	
            }
        else {
            return;
            }
    }
    destination.innerHTML = "";
    destination.appendChild(tile);
    origin.innerHTML=getLettersOnSquare(fromWhere);
    //create and leave behind a ghost tile if starting from the rack
    if (includes("s", fromWhere)){
        let ghostTile = tile.cloneNode(true);
        ghostTile.removeAttribute('id');
        ghostTile.classList.add("ghost");
        // ghostTile.style.visibility = "hidden";
        origin.appendChild(ghostTile);
    }

}

function replenishRack() {

    
    let rack = document.getElementById("rack");
    let spaces = rack.children;
    for (space of spaces) { 
        let tile = space.children[0];
        if (!tile.classList.contains("ghost")) {continue;}
        tile.classList.remove("ghost");
        let pickedTile = pickRandomTile();
        let picked = [pickedTile[1], pickedTile[2]];
        tile.children[1].innerHTML = picked[0];
        tile.children[2].innerHTML = picked[1];
        newid = pickedTile[0].toString() + pickedTile[1]+ pickedTile[2];
        tile.id = newid;
    }

    document.getElementById("tile-counter").innerHTML = tilesArray.length;

    
}



function shuffle(arr){

    let L = arr.length -1;
    let sarr = arr;

    for(let i = L; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = sarr[i];
        sarr[i] = arr[j];
        sarr[j] = temp;
    }
    return sarr;
}

function pickRandomTile() {
    if (tilesArray.length % 5==0){ tilesArray = shuffle(tilesArray);		}
    pickedTile= tilesArray.pop()
    return pickedTile;
}

function exchangeTiles(slot1, slot2){
    if (slot1===slot2) {return;}
    let origin = document.getElementById(slot1);
    let destination = document.getElementById(slot2);
    let tile1 = origin.getElementsByTagName('div')[0];
    let tile2 = destination.getElementsByTagName('div')[0];
    let temp1 = tile1.cloneNode(true);
    let temp2 = tile2.cloneNode(true);
    origin.removeChild(tile1);
    destination.removeChild(tile2);
    origin.appendChild(temp2);
    destination.appendChild(temp1);
}

function shuffle_rack(){
    let newOrder = shuffle(["s1","s2","s3","s4","s5","s6","s7"]);
    for (let i=1;i<8;i++){
        let curLoc = "s"+i.toString();
        let newLoc = newOrder[i-1];
        exchangeTiles(curLoc,newLoc);
    }
}

document.getElementById("replenish").addEventListener("click", replenishRack);
document.getElementById("shuffle").addEventListener("click", shuffle_rack);





