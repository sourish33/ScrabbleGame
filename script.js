

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

let boosterValue = {};
boosterValue[" "]


let tilesArray;
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

//These prevent spurious webpages from opening by dragging
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

function getUniques(arr){//returns unique elements in an array
    return Array.from(new Set(arr));
}


function subtractArrays(arr1,arr2){
    return arr1.filter(value => !arr2.includes(value));
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


function generateRows(){
    let rows = [];
    for (let i =97; i<112;i++) { 
        rows.push(String.fromCharCode(i));
    }
    return rows;
}

function generateCols() {
    let cols = [];
    for (let i=1;i<16;i++) {
        cols.push(i.toString());
    }
    return cols;
}


function includes(strToCheck, word) {	
    return (word.indexOf(strToCheck) > -1 ? true : false)
}

function getTileAt(address){
    let square = document.getElementById(address);
    return getTheTile(square);
}

function getTheTile(square){//square is the object (div) that holds the tile
    if (!square) { return null;}
    return square.getElementsByTagName('div')[0];
}


function getLettersOnSquare(whichSquare){//check if the square has TW, DL etc
    if (Array.isArray(whichSquare)) {
        let u = [];
        for (elem of whichSquare){
            u.push(getLettersOnSquare(elem));
        }
        return u;

    } else {
        let u = boosters[whichSquare];
        return (u!=null ? u : "");
    }
}

function move(fromWhere, toWhere) {
    let origin = document.getElementById(fromWhere);
    let destination = document.getElementById(toWhere);
    if (origin===destination){return;}
    if (origin==null || destination==null) {return;}
    let tile = getTheTile(origin);
    let tileAlreadyThere = getTheTile(destination);

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
        origin.appendChild(ghostTile);
    }
    //add the played-not-submitted class to any tile placed on the board and remove it if the tile is moved.
    if ( !includes("s", toWhere) ){
        destination.classList.add("played-not-submitted");
    }
    if (!includes("s", fromWhere)){
        origin.classList.remove("played-not-submitted")

    }

}

function placeTileOnRack(space_id){
    if (tilesArray.length==0) {return;}
    space = document.getElementById(space_id);
    tile = getTheTile(space);
    if (!tile.classList.contains("ghost")) {return;}
    tile.classList.remove("ghost");
    let pickedTile = pickRandomTile();
    let picked = [pickedTile[1], pickedTile[2]];
    tile.children[1].innerHTML = picked[0];
    tile.children[2].innerHTML = picked[1];
    newid = pickedTile[0].toString() + pickedTile[1]+ pickedTile[2];
    tile.id = newid;
}



    function replenishRack() {

        if (tilesArray.length ==0) {return;}
        for (let j=1;j<8;j++){
            rackpos = "s"+j.toString();
            placeTileOnRack(rackpos);
        }
    }

    function isEmptyOnRack(space_id){
        let space = document.getElementById(space_id);
        let tile = getTheTile(space);
        return tile.classList.contains("ghost") ? true : false;
    }


    function findEmptyRackPosition(){//Find an empty position on the rack   
        let emptySlot;
        for (let j=1;j<8;j++) {
            let space_id = "s"+j.toString();
            if (isEmptyOnRack(space_id)) { 
                emptySlot=space_id;
                break;
            }
        }
        return emptySlot;

    }

    function populateBoard(n) {//Place n tiles on the board 

        if (tilesArray.length ==0) {return;}
        if (n>tilesArray.length) { n=tilesArray.length;}
        let squares = document.getElementsByClassName("grid-item");
        let filledSquares = document.getElementsByClassName("played-not-submitted");
        let squaresArray = Object.values(squares);//collects all squares into an array
        let filledSquaresArray = Object.values(filledSquares);//collects filled squares into an array
        let unfilledSquares = shuffle(subtractArrays(squaresArray, filledSquaresArray));
        let unfilledSquareIDs =[];
        for (square of unfilledSquares){
            unfilledSquareIDs.push(square.id);
            }
        //Find an empty position on the rack, place picked tiles there and then move the tiles from there on to the board 

        let unfilledPos = findEmptyRackPosition();
        
        if (unfilledPos== null) {
            console.log("No position available on rack");
            return;
        }
        for (let i=0;i<n;i++){
            placeTileOnRack(unfilledPos);
            move(unfilledPos,unfilledSquareIDs.pop());
        }


    // replenishRack()
    // for (let j=0;j<8;j++){
    //     rackpos = "s"+j.toString();
    //     move(rackpos,squareIDs.pop());
    // }

}





function pickRandomTile() {
    if (tilesArray.length ==0) {return;}
    if (tilesArray.length % 5==0){ tilesArray = shuffle(tilesArray);		}
    pickedTile= tilesArray.pop()
    document.getElementById("tile-counter").innerHTML = tilesArray.length;
    return pickedTile;
}


function exchangeTiles(slot1, slot2){
    if (slot1===slot2) {return;}
    let origin = document.getElementById(slot1);
    let destination = document.getElementById(slot2);
    // let tile1 = origin.getElementsByTagName('div')[0];
    // let tile2 = destination.getElementsByTagName('div')[0];
    let tile1 = getTheTile(origin);
    let tile2 = getTheTile(destination);
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
        if (!isEmptyOnRack(curLoc) && !isEmptyOnRack(newLoc))
            {exchangeTiles(curLoc,newLoc);}
    }
}

function getTilesOnBoard(){
    let u = getTilesSubmitted();
    let v = getTilesPlayedNotSubmitted();
    return u.concat(v);
}

function getTilesSubmitted(){
    let u = document.getElementsByClassName("submitted");
    return Object.values(u);
}

function getTilesPlayedNotSubmitted(){
    let u = document.getElementsByClassName("played-not-submitted");
    return Object.values(u);
}

// function getSquareNumber(s) {//converts a cell address to a numerical value i.e. a1 = 1 , o15 = 225 etc
//     let firstDigit = s.charCodeAt(0)-97;
//     let secondDigit = parseInt(s.substr(1));
//     return firstDigit*15+secondDigit;
// }

// function getCellAddress(s) {
//     let firstchar = String.fromCharCode(parseInt(s/15)+97);
//     let lastdigit = (s%15).toString();
//     return firstchar+lastdigit;
// }



function getHorWords(row) {//finds all 2-letter and higher words in row (e.g "a" or "h")

    let wordbag = [];
    let word =[];

    for (let i =1; i<16; i++) {
        let curloc = row+i.toString();
        if (getTileAt(curloc) ==null) {
            if (word.length!=0) {
                wordbag.push(word); 
                word =[];
            }
        } else{
            word.push(curloc);
        }
    }
    wordbag.push(word);
    if (wordbag.length ===0) {return [];}
    for (x of wordbag) {//only keep two letter words and above
        if (x.length ===0 || x.length ===1) {
            wordbag = wordbag.filter(function(item) {
                return item !== x;
            })

        }
    }
    return wordbag;
}

function getVerWords(num) {//finds all 2-letter and higher words in column (e.g "a" or "h")

    if (typeof(num) !== "string"){
        num = num.toString();
    }

    let rows = generateRows();

    let wordbag = [];
    let word =[];

    for (let i =0; i<15; i++) {
        let curloc = rows[i]+num;
        if (getTileAt(curloc) ==null) {
            if (word.length!=0) {
                wordbag.push(word); 
                word =[];
            }
        } else{
            word.push(curloc);
        }
    }
    wordbag.push(word);
    if (wordbag.length ===0) {return [];}
    for (x of wordbag) {//only keep two letter words and above
        if (x.length ===0 || x.length ===1) {
            wordbag = wordbag.filter(function(item) {
                return item !== x;
            })

        }
    }
    return wordbag;
}

function getPlayedRows(played){
    //find rows of new letters placed on the board from the list of played tiles (played)
    let rows =[];
    played.forEach((tile)=>{rows.push(tile.id[0]);});
    rows = getUniques(rows);
    return rows;
}

function getPlayedCols(played){
    //find cols of new letters placed on the board from the list of played tiles (played)
    let cols =[];
    played.forEach((tile)=>{cols.push(tile.id.substring(1));})
    cols = getUniques(cols);
    return cols;
}

function getAllHorWords(){

    let played = getTilesPlayedNotSubmitted();
    // gets all new horizontal words
    let rows = getPlayedRows(played);
    if (rows.length ===0) { return;}
    
    let allHorWords = [];
    for (row of rows){
        let u = getHorWords(row);
        if (u.length!==0){ allHorWords.push(u);}  
    }
    return allHorWords.flat();

}

function getAllVerWords(){

    //gets all new vertical words
    let played = getTilesPlayedNotSubmitted();
    let cols = getPlayedCols(played);
    if (cols.length ===0) { return;}

    let allVerWords = [];
    for (col of cols){
        let u = getVerWords(col);
        if (u.length!==0){ allVerWords.push(u);}  
    }
    return allVerWords.flat();

}

function getAllNewWords(){
    let allWords =[];

    allWords.push(getAllHorWords());
    allWords.push(getAllVerWords());

    return allWords.flat();

}

function readWord(arr){
    let word =[];
    for (space_id of arr){
        let tile = getTileAt(space_id);
        let letter =tile.children[1].innerHTML;
        word.push(letter);
    }
    return word.join('');
}

function readAllWords(wordarray){
    if (wordarray.length ===0) { return [];}
    let words =[];
    for (arr of wordarray){
        words.push(readWord(arr));
    }
    return words;
}

function isContiguous(arr){//takes an array of letters or numbers and returns true if they are contiguous

    if (arr.length <2) {return true;}
    
    if (isNaN(arr[0])) { //an array of letters
        arr.sort();
        for (i=0;i<arr.length-1; i++){ 
            let u = arr[i].charCodeAt(0);  
            let v = arr[i+1].charCodeAt(0);
            // console.log(`${i}-th is ${u} and ${i+1}-th is ${v}`);
            if (v!=u+1) {return false;}  
            }
        }

        if (!isNaN(arr[0])) { //an array of numbers NOT READY YET
            arr.sort(function(a, b){return a - b});
            for (i=0;i<arr.length-1; i++) { 
                let u = parseInt(arr[i]);
                let v = parseInt(arr[i+1]);
               // console.log(`${i}-th is ${u} and ${i+1}-th is ${v}`);
                if (v!=u+1) {return false;}  
            }
        }
        return true;
    }




function play(){//makes tiles stuck when play button is pressed
    let tiles = getTilesPlayedNotSubmitted();
    let cols = getPlayedCols(tiles);
    let rows = getPlayedRows(tiles);
    if (!isContiguous(rows) || !isContiguous(cols)) { 
        alert("All your tiles are not contiguous");
        return;
    }

    for (tile of tiles) {
        tile.classList.remove("played-not-submitted");
        tile.classList.add("submitted");
        tile.setAttribute("ondragstart","return false");
        tile.classList.add("unselectable");
        // tile.classList.add("played");
    }
}

document.getElementById("replenish").addEventListener("click", replenishRack);
document.getElementById("shuffle").addEventListener("click", shuffle_rack);
document.getElementById("play").addEventListener("click", play);


//TODO
/*  
- Animation for play button
- two players with different racks which toggle upon play
- calculate scores
*/




