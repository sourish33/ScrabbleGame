

let boosters = fillBoosters();
let legalPositions = getlegalPositions();
let moveNumber =1;
let settings = getSettings();
let dictionaryChecking = settings[0];
let randomize = settings[1];
let endgame = settings[2];

let playerNames = getPlayerNames();
let numPlayers  = playerNames.length;
if (randomize) {playerNames= shuffle(playerNames);}
let players = {};
let maxPoints =50000000;
let maxWords = 550000;
if (endgame=="75pt") {maxPoints =75;}
if (endgame=="150pt") {maxPoints =150;}





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
            // console.log(`[${count},${x[1]}, ${x[2]}]`);
            tilesArray.push(newlist);
            count++;
        }
    }

})();


function fillBoosters() {
        let boosters ={};
        let rows = generateRows();
        let cols = generateCols();
        for (let row of rows){
            for (let col of cols) {
                let square_id = row+col;
                // console.log(`boosters[${square_id}]`);
                let writtenOnSquare = document.getElementById(square_id).innerHTML;
                boosters[square_id] = writtenOnSquare; 
            }
        }
        return boosters;
    }

function getSettings(){
    let d = sessionStorage.getItem("dictionary");
    let dictcheck = (d === "1" ? true : false);

    let r = sessionStorage.getItem("randomize");
    let toRandomize = (r === "1" ? true : false);

    let end = sessionStorage.getItem("gameend");
    return ([dictcheck, toRandomize,end]);
}


function getPlayerNames(){ 
    let playerNames = []
    for (let x of ["1","2","3","4"]){
        let pvar = `player${x}Name`;
        let theName = sessionStorage.getItem(pvar);
        if (theName !== "_"){ playerNames.push(theName);}
    }
    return playerNames;
}

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
    if (origin==="" || destination==="") {return;}
    move(origin,destination);
    displayScore();
    // event.dataTransfer.clearData();
}

function onDropRackTile(event) {
    let incoming = event.dataTransfer.getData('text');
    let destination = event.target.parentElement.parentElement.id;
    if (destination==="rack") {return;} 
    console.log(destination);
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

 function arrayRemove(arr, value) { //removes value from array
     return arr.filter(function(element){ return element != value; });
    }

 function shuffle(arr){

    let L = arr.length -1;
    let sarr = Array.from(arr);//cannot use = cuz JS passes by reference in this case

    for(let i = L; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = sarr[i];
        sarr[i] = sarr[j];
        sarr[j] = temp;
    }
    return sarr;
}

function findCommonElements(arr1, arr2) { //same as findCommonElements
    return arr1.filter(item => arr2.includes(item)) 
} 

function multiplyArrays(arr1, arr2){//dot product
    if (arr1.length !== arr2.length){
        console.log("cant multiply arrays of different sizes");
        return null;
    }
    var result=0;
    for (var i=0; i<arr1.length;i++){
        result+=arr1[i]*arr2[i];   
    }
    return result;
}

function multiplyScalar(a, b) {
    let num, arr;
    if (Array.isArray(a)){
        arr = a;
        num = b;
    } else {
        arr = b;
        num =a;
    }
    let result = [];
    for (let i=0; i<arr.length;i++){
        result.push(arr[i]*num);
    }
    return result;
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

function getRackIds(rackid="rack") {//finds the rack element and grabs the ids of the slots
    let rack = document.getElementById(rackid);
    let rackSlots = rack.children;
    let rackSlotIds = [];
    for (slot of rackSlots) {
        rackSlotIds.push(slot.id);
    }
    return rackSlotIds;
}


function includes(strToCheck, word) {	
    return (word.indexOf(strToCheck) > -1 ? true : false)
}

function isEmptyOnBoard(space_id){
    if  (document.getElementById(space_id)==null){
        console.log(`Bad space_id ${space_id} send to isEmptyOnBoard`);
        return false;
    }
    let u = document.getElementById(space_id).children;
    return (u.length ===0 ? true : false) 
}

function getTileAt(address){
    if (isEmptyOnBoard(address)){
        return null;
    }
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

function isLetter(c) {
    return c.toLowerCase() != c.toUpperCase();
  }

function isNumeric(value) {
    return /^\d+$/.test(value);
}

function moveOnRack(fromWhere, toWhere){
    console.log(`moving from ${fromWhere} to ${toWhere}`);
    let origin = document.getElementById(fromWhere);
    let destination = document.getElementById(toWhere);
    let tile = getTheTile(origin);
    let tileAlreadyThere = getTheTile(destination);
    if(tile.classList.contains("ghost")){return;}//leave ghost tiles alone
    if(destination.classList.contains("ghost")){
        console.log("Handling move to ghost tile")
        destination.removeChild(tileAlreadyThere);
        destination.appendChild(tile);
        origin.removeChild(tile);
    }

    let ni = parseInt(fromWhere[1]);
    let nf = parseInt(toWhere[1]);
    if (ni<nf) {
            for(let c=ni;c<nf;c++){
                let a = `s${c}`;
                let b = `s${c+1}`;
                console.log(`s${c}<->s${c+1}`);
                switchSpots(a,b);
            }
    } else if (ni>nf){
            for(let c=ni;c>nf;c--){
                let a = `s${c}`;
                let b = `s${c-1}`;
                console.log(`s${c}<->s${c-1}`);
                switchSpots(a,b);
            }
    }

    return;
}

function checkNameOfLocation(loc) {
    let validOnScreenName = (/^([a-z]\d+)$/.test(loc));
    let validOffScreenName = (/^(\d+[a-z]\d+)$/.test(loc));
    if (!validOffScreenName && !validOnScreenName) {
        console.log(`${loc} is bad location for a move`)
    }
    return ((validOnScreenName || validOffScreenName) ? true : false);
}



function move(fromWhere, toWhere) {

    if (fromWhere==="rack" || toWhere ==="rack") {return;}
    if (!checkNameOfLocation(fromWhere) || !checkNameOfLocation(toWhere)) {return;}

    if (fromWhere === toWhere) {return;}
    let origin = document.getElementById(fromWhere);
    let destination = document.getElementById(toWhere);
    if (origin==null || destination==null) {return;}
    let tile = getTheTile(origin);
    let tileAlreadyThere = getTheTile(destination);
    if(tile.classList.contains("ghost")){return;}//leave ghost tiles alone
    

    if (fromWhere[0]==="s" && toWhere[0]==="s") {//mmoving tiles around on the rack, making tiles shift  to create space for the incoming tile
             moveOnRack(fromWhere, toWhere);
        return;
    }

    let fromRack = includes("s", fromWhere);
    let toRack = includes("s", toWhere);
    let fromBoard = !includes("s", fromWhere);
    let toBoard = !includes("s", toWhere);





    let blankTile = false;
    if (tile.children[2].innerHTML==="0"){ blankTile=true;}

    if (tile.children[1].innerHTML==="_" && toBoard){// untouched blank tile at origin
        let newLetter  = prompt("Please choose a letter for this tile:", "_");
        if (newLetter == null || newLetter == "") {
            return;
          } 
        newLetter = newLetter.charAt(0);
        if (!isLetter(newLetter)) {return;}
        tile.children[1].innerHTML = newLetter.toUpperCase();

    }

    

    if (tileAlreadyThere != null) { 
        if (tileAlreadyThere.classList.contains("ghost"))
        //going back to the rack, a ghost tile should be discarded
            {
                destination.removeChild(tileAlreadyThere);	
            }
    
    }
    destination.innerHTML = "";
    destination.appendChild(tile);
    origin.innerHTML=getLettersOnSquare(fromWhere);
    //create and leave behind a ghost tile if starting from the rack



    if (blankTile && toRack){
        tile.children[1].innerHTML = "_";
    }


    if (fromRack){
        let ghostTile = tile.cloneNode(true);
        ghostTile.removeAttribute('id');
        ghostTile.classList.add("ghost");
        origin.appendChild(ghostTile);
    }
    //add the played-not-submitted class to any tile placed on the board and remove it if the tile is moved.
    if ( toBoard ){
        destination.classList.add("played-not-submitted");
    }
    if (fromBoard){
        origin.classList.remove("played-not-submitted")

    }
    fixSizesAttribs();

}



function fixSizesAttribs(){
    let rack = document.getElementById("rack");
    let rackslots = rack.children;
    if (rackslots.length===0) {return;}
    
    for (slot of rackslots){
        if (slot.children.length ===0) {break;}
        if (slot.children[0].children[1]==null) {break;}
        slot.children[0].children[1].classList.add("centered-on-rack");
        slot.children[0].children[2].classList.add("bottom-right-on-rack");
        slot.children[0].setAttribute("ondrop", "onDropRackTile(event)");

        slot.children[0].children[1].classList.remove("centered");
        slot.children[0].children[2].classList.remove("bottom-right");
    }

    let tilesOnBoard = getTilesPlayedNotSubmitted();
    if (tilesOnBoard.length===0) {return;}
    for (tile of tilesOnBoard){
        tile.children[0].children[1].classList.remove("centered-on-rack");
        tile.children[0].children[2].classList.remove("bottom-right-on-rack");
        tile.children[0].removeAttribute("ondrop");

        tile.children[0].children[1].classList.add("centered");
        tile.children[0].children[2].classList.add("bottom-right");
    }

}

function placeTileOnRack(space_id){
    //pick a tile from the bag and put it on the rack
    if (!checkNameOfLocation(space_id)) {return;}
    if (tilesArray.length==0) {return;}
    space = document.getElementById(space_id);
    tile = getTheTile(space);
    if (!tile.classList.contains("ghost")) {return;}//Not putting a tile there if one already exists
    tile.classList.remove("ghost");
    let pickedTile = pickRandomTile();
    let picked = [pickedTile[1], pickedTile[2]];
    tile.children[1].innerHTML = picked[0];
    tile.children[2].innerHTML = picked[1];
    newid = pickedTile[0].toString() + pickedTile[1]+ pickedTile[2];
    tile.id = newid;
    fixSizesAttribs();
}



    function replenishRack() {

        if (tilesArray.length ==0) {return;}
        let rackSlots = getRackIds("rack");
        for (slot of rackSlots){
            placeTileOnRack(slot);
        }
    }

    function isEmptyOnRack(space_id){
        if (!checkNameOfLocation(space_id)) {return;}
        let space = document.getElementById(space_id);
        let tile = getTheTile(space);
        return tile.classList.contains("ghost") ? true : false;
    }

    function rackEmpty(rack_id){
        let rackSquares = getRackIds(rack_id);
        for (rackSquare of rackSquares){
            if (!isEmptyOnRack(rackSquare)) {return false; }
        }
        return true;
    }


    function findEmptyRackPosition(rack="rack"){//Find an empty position on the rack, default is "rack"  
        let emptySlot;
        let rackSlots = getRackIds(rack);
        for (slot of rackSlots) {
            if (isEmptyOnRack(slot)) { 
                emptySlot=slot;
                break;
            }
        }
        return emptySlot;
    }


function pickRandomTile() {
    if (tilesArray.length ==0) {return;}
    let n = Math.floor(Math.random() * tilesArray.length); 
    pickedTile = tilesArray.splice(n,1);
    document.getElementById("tile-counter").innerHTML = tilesArray.length;
    return pickedTile.flat();
}

function pickSpecificTile(n) {
    if (tilesArray.length ==0) {return;}
    pickedTile = tilesArray.splice(n,1);
    document.getElementById("tile-counter").innerHTML = tilesArray.length;
    return pickedTile.flat();
}

function placeSpecificTileOnRack(space_id, pickedTile){
    //pick a tile from the bag and put it on the rack
    if (tilesArray.length==0) {return;}
    if (!checkNameOfLocation(space_id)) {return;}
    space = document.getElementById(space_id);
    tile = getTheTile(space);
    if (!tile.classList.contains("ghost")) {return;}//Not putting a tile there if one already exists
    tile.classList.remove("ghost");
    let picked = [pickedTile[1], pickedTile[2]];
    tile.children[1].innerHTML = picked[0];
    tile.children[2].innerHTML = picked[1];
    newid = pickedTile[0].toString() + pickedTile[1]+ pickedTile[2];
    tile.id = newid;
}

function switchSpots(slot1, slot2){
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
    let oldOrder =getRackIds("rack");
    let newOrder = shuffle(oldOrder);
    for (let i=1;i<8;i++){
        let curLoc = oldOrder[i-1];
        let newLoc = newOrder[i-1];
        if (!isEmptyOnRack(curLoc) && !isEmptyOnRack(newLoc))
            {switchSpots(curLoc,newLoc);}
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

function getSquareNumber(s) {//converts a cell address to a numerical value i.e. a1 = 1 , o15 = 225 etc
    let firstDigit = s.charCodeAt(0)-97;
    let secondDigit = parseInt(s.substr(1));
    return firstDigit*15+secondDigit;
}

function getCellAddress(s) {
    if (s<1 || s>225) {return null;}
    let firstchar = String.fromCharCode(parseInt((s-1)/15)+97);
    let lastdigit = (s%15 === 0 ? 15 : s%15);
    return firstchar+lastdigit.toString();
}



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
        if (x.length ===0 || x.length ===1) { // 
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

function getPlayedIds(played){
    //find rows of new letters placed on the board from the list of played tiles (played)
    let ids =[];
    played.forEach((tile)=>{ids.push(tile.id);});
    return ids;
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
    let played_ids = getPlayedIds(played);
    // gets all new horizontal words
    let rows = getPlayedRows(played);
    if (rows.length ===0) { return [];}
    
    let allHorWords = [];
    for (row of rows){
        let u = getHorWords(row);
        if (u.length!==0){ allHorWords.push(u);}  
    }
    allHorWords = allHorWords.flat();
    let allHorWords_fin =[];
    for (word of allHorWords){//words should have at least one new letter
        let intersection = word.filter(x => played_ids.includes(x));
        if (intersection.length !== 0){ 
            allHorWords_fin.push(word);
        }
    }

    return allHorWords_fin;

}

function getAllVerWords(){

    //gets all new vertical words
    let played = getTilesPlayedNotSubmitted();
    let played_ids = getPlayedIds(played);
    let cols = getPlayedCols(played);
    if (cols.length ===0) { return [];}

    let allVerWords = [];
    for (col of cols){
        let u = getVerWords(col);
        if (u.length!==0){ allVerWords.push(u);}  
    }
    allVerWords= allVerWords.flat();
    let allVerWords_fin =[];
    for (word of allVerWords){//words should have at least one new letter
        let intersection = word.filter(x => played_ids.includes(x));
        if (intersection.length !== 0){ 
            allVerWords_fin.push(word);
        }
    }

    return allVerWords_fin;

}

function getAllNewWords(){
    let allWords =[];

    allWords.push(getAllHorWords());
    allWords.push(getAllVerWords());

    return allWords.flat();

}

function readLetter(space_id){
    if (includes("s", space_id) && isEmptyOnRack(space_id)){return;}
    if (!includes("s", space_id) && isEmptyOnBoard(space_id)){return;}
    let tile = getTileAt(space_id);
    let letter =tile.children[1].innerHTML;
    return letter;
}

function readPoint(space_id){
    if (includes("s", space_id) && isEmptyOnRack(space_id)){return;}
    if (!includes("s", space_id) && isEmptyOnBoard(space_id)){return;}
    let tile = getTileAt(space_id);
    let point =tile.children[2].innerHTML;
    point = parseInt(point);
    return point;
}

function changeLetter(space_id, letter){

    if (!isLetter(letter) && letter!=="_"){return;}
    if (includes("s", space_id) && isEmptyOnRack(space_id)){return;}
    if (!includes("s", space_id) && isEmptyOnBoard(space_id)){return;}
    let tile = getTileAt(space_id);
    tile.children[1].innerHTML = letter.toUpperCase();
}

function readWord(arr){
    let word =[];
    for (space_id of arr){
        // let tile = getTileAt(space_id);
        // let letter =tile.children[1].innerHTML;
        let letter = readLetter(space_id)
        word.push(letter);
    }
    return word.join('');
}


function readPoints(arr){
    //reads off the point values of the letters of a word
    let points =[];
    for (space_id of arr){
        // let tile = getTileAt(space_id);
        // let point =tile.children[2].innerHTML;
        let point = readPoint(space_id);
        points.push(point);
    }
    return points;
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
            if (v!=u+1) {return false;}  
            }
        }

        if (!isNaN(arr[0])) { //an array of numbers
            arr.sort(function(a, b){return a - b});
            for (i=0;i<arr.length-1; i++) { 
                let u = parseInt(arr[i]);
                let v = parseInt(arr[i+1]);
                if (v!=u+1) {return false;}  
            }
        }
        return true;
    }

    function isolatedLetter(sq_id){
        for (el of neighbors(sq_id)) {
            if (!isEmptyOnBoard(el)) {
                return false;
            }
        }
        return true;
    }

    function checkForIsolatedLetters(arr){
        for (el of arr){
            if (isolatedLetter(el)) {
                return true;
            }
        }
        return false;
    }

    function checkLegalPlacement(tiles){
        let cols = getPlayedCols(tiles);
        let rows = getPlayedRows(tiles);
        let ids = getPlayedIds(tiles);
        if (!(rows.length ===1 || cols.length ===1)) {
            console.log("letters submitted are not in the same row or col");
            return false;
        }

        if (getAllIslandWords().length!==0) {
            console.log("illegal words");
            return false;
        }

        if (checkForIsolatedLetters(ids)) {
            console.log("isolated letters");
            return false;
        }

 
        
        return true;
    }

    function checkIfLegal(wordarray) {//returns a list of words not in the scrabble dictionary
        let bads =[];
        for (word of wordarray){
            if (!checkDict(word)) {bads.push(word);}
        }
        return bads;
    }

    function getAllIslandWords()//find words which are illegal because they are not adjacent to played letters
    {
        let newWords = getAllNewWords();
        let played = getTilesPlayedNotSubmitted()
        if (newWords.length ===0) {return [];}

        let illegals = [];
        for (let word of newWords) {
            let intersection = word.filter(x => legalPositions.includes(x));
            if (intersection.length ===0) {
                illegals.push(word);
            }
        }

        return illegals;

    }


function getTopper(){
    let currScores = [];
    for (player of Object.values(players)){
        currScores.push(player.score);
    }
    let maxscore = Math.max(...currScores);
    let maxscorer;

    for (player of Object.values(players)){
        if (player.score === maxscore) {
            maxscorer = player.name;
        } 
    }
    return [maxscorer, maxscore]
}

function endCheck(){

    let maxscore = getTopper()[1];
    if (maxscore>=maxPoints) {return 1;}

    if (tilesArray.length===0) {return 2;}

    return 0;
}

function displayMove(){
    let newWords = getAllNewWords();
    tiles = getPlayedIds(getTilesPlayedNotSubmitted());
    let playedWord = []
    if (newWords.length ==0){return;}
    if (newWords.length ==1) {
        playedWord=newWords[0];
    }else {
        playedWord= newWords.sort((x,y)=>{
        let u = findCommonElements(x,tiles);
        let v= findCommonElements(y,tiles);
        return v.length-u.length;
    })[0]
    }
    // let wordsPlayed = readAllWords(getAllNewWords());
    let lw = document.getElementById("lastPlayed");
    lw.innerHTML = `Played: ${readWord(playedWord)} for ${score()}`;
    lw.classList.remove("not-there");
    // console.log(`Played: ${wordsPlayed.join(', ')}`);
}

function AI_playGotMove(){
    legalPositions = getlegalPositions();
    let who= whoseMove(moveNumber,numPlayers);
    let tiles = getTilesPlayedNotSubmitted();
    displayMove()
    players[who].addPoints(score());
    players[who].removePieces();
    updateScoreBoard();
    for (tile of tiles) {
        tile.classList.remove("played-not-submitted");
        tile.classList.add("submitted");
        tile.setAttribute("ondragstart","return false");
        tile.classList.add("unselectable");
    }
    let gameCheck = endCheck();
    if (gameCheck===0)
    {
        //advance the movenumber
        moveNumber++;
        who= whoseMove(moveNumber,numPlayers);
        // if (!includes("AI_", players[who].name)) {
        //     alert(`Please pass to ${players[who].name}`);
        // }
        document.getElementById("who-is-playing").innerHTML=players[who].name;
        players[who].returnPieces();
        replenishRack();
        //reset the possible points 
        document.getElementById("points").innerHTML = 0;
        //update the list of legal positions
        legalPositions = getlegalPositions();
        if (includes("AI_", players[who].name)) {
            AI_play();
        } else{
            play();
        }
    }
    else {
        endGameSequence(gameCheck);
    }
}

function AI_play(){
    legalPositions = getlegalPositions();
    let who= whoseMove(moveNumber,numPlayers);
    players[who].makeMove();
    let tiles = getTilesPlayedNotSubmitted();
    if (tiles.length === 0) {
        // console.log(`${players[who]}$ AI is thinking...`)
        return;
    } else {
        AI_playGotMove();
    }
    
}


function play(){//makes tiles stuck and animates new tiles when play button is pressed

    let tiles = getTilesPlayedNotSubmitted();
    if (tiles.length === 0) {return;} //nothing submitted yet

    if (!checkLegalPlacement(tiles)) {
        alert("Tile placement illegal");
        return;
    }

    if (dictionaryChecking) {
        let wordarray = readAllWords(getAllNewWords());
        let notAWords = checkIfLegal(wordarray);
        if (notAWords.length!==0){
            let msg =`${notAWords.join(", ")} not valid` ;
            alert(msg);
            return;
        }
    }

    let who= whoseMove(moveNumber,numPlayers);
    displayMove();
    players[who].addPoints(score());
    players[who].removePieces();
    updateScoreBoard();

    for (tile of tiles) {
        tile.classList.remove("played-not-submitted");
        tile.classList.add("submitted");
        tile.setAttribute("ondragstart","return false");
        tile.classList.add("unselectable");
    }

    //is the game over?
    let gameCheck = endCheck();

    if (gameCheck===0)
    {
        //clear the search results
        let searchresult = document.getElementsByClassName("searchresult")[0];
        searchresult.innerHTML ="";
        //advance the movenumber
        moveNumber++;
        who= whoseMove(moveNumber,numPlayers);
        // alert(`Please pass to ${players[who].name}`);
        if (!includes("AI_", players[who].name)){
            alert(`Please pass device to ${players[who].name}`);
        }
        document.getElementById("who-is-playing").innerHTML=players[who].name;
        players[who].returnPieces();
        replenishRack();
        //reset the possible points 
        document.getElementById("points").innerHTML = 0;
        //update the list of legal positions
        legalPositions = getlegalPositions();
        if (includes("AI_", players[who].name)) {
            AI_play();
        } else{
            play();
        }
    }
    else {
        endGameSequence(gameCheck);
    }

}

function endGameSequence(n) {
    if (n===1 || n===2){
        winner =getTopper()[0];
        let m = document.getElementById("messagebox");
        m.classList.remove("not-there");
        document.getElementById("winner").innerHTML=winner;
        document.getElementById("play").classList.add("not-there");
        // document.getElementById("twolw-list").classList.add("not-there");
        // document.getElementById("submittedWord").classList.add("not-there");
        document.getElementById("cat-gif").classList.remove("not-there");
    }
}


function pass(confirm=true)
{
    if (confirm) {
        let confirmPass = confirm("Are you sure you want to pass your turn?")
        if (!confirmPass){return}
    }
    
    let onboard = getTilesPlayedNotSubmitted();
    if (onboard.length!==0) {returnToRack();}

    who= whoseMove(moveNumber,numPlayers);
    players[who].addPoints(score());
    players[who].removePieces();
    updateScoreBoard();

    //clear the search results
    let searchresult = document.getElementsByClassName("searchresult")[0];
    searchresult.innerHTML ="";
    //advance the movenumber
    moveNumber++;
    who= whoseMove(moveNumber,numPlayers);
    if (!includes("AI_", players[who].name)){
        alert(`Please pass device to ${players[who].name}`);
    }
    document.getElementById("who-is-playing").innerHTML=players[who].name;
    players[who].returnPieces();
    replenishRack();
    //reset the possible points 
    document.getElementById("points").innerHTML = 0;
    //update the list of legal positions
    legalPositions = getlegalPositions();
    if (includes("AI_", players[who].name)) {
        AI_play();
    } else{
        play();
    }

}

function wordScore(arr){
    //given a word e.g ["g1", "g2", "g3"] find its score
    let points = readPoints(arr);
    let place_vals = getLettersOnSquare(arr);
    let multipliers = [];
    let boosters = 1;

    //disregard boosters and multipliers for already-submitted tiles
    for (let i=0;i<place_vals.length; i++){
        let sq_id = arr[i];
        let t=document.getElementById(sq_id);
        if (t.classList.contains("submitted")) {
            place_vals[i] = "";
        }

    }

    for (let val of place_vals) {

        switch(val) {
            case "":
              multipliers.push(1);
              break;
            case "DL":
                multipliers.push(2);
              break;
            case "TL":
                multipliers.push(3);
              break;
            case "DW":
                multipliers.push(1);
                boosters = 2;
              break;
            case "TW":
                multipliers.push(1);
                boosters = 3;
              break;
            case getLettersOnSquare("h8") :
                multipliers.push(1);
                boosters = 2;
              break;
              
            default:
                multipliers.push(1);
                console.log(`Strange place value of ${val}`)
          }
    }

    let dotProduct = multiplyArrays(points, multipliers);
    return boosters*dotProduct;
}

function displayScore() {
    let u = score();
    document.getElementById("points").innerHTML = u;
}


function updateScoreBoard(){
    document.getElementById("pl1").innerHTML = players[1].name;
    document.getElementById("pl1-points").innerHTML = players[1].score;
    
    document.getElementById("pl2-points").innerHTML = players[2].score;
    document.getElementById("pl2").innerHTML = players[2].name;

    if (numPlayers===3){
        document.getElementById("pl3-points").innerHTML = players[3].score;
        document.getElementById("pl3").innerHTML = players[3].name;
    }
    if (numPlayers===4){
        document.getElementById("pl3-points").innerHTML = players[3].score;
        document.getElementById("pl3").innerHTML = players[3].name;

        document.getElementById("pl4-points").innerHTML = players[4].score;
        document.getElementById("pl4").innerHTML = players[4].name;
    }
}

function score(){//find the scores of all the words in the list
    let tiles = getTilesPlayedNotSubmitted();
    if (tiles.length === 0) {return 0;}
    let totalPoints = 0;
    if (!checkLegalPlacement(tiles)) {
        return totalPoints;
    }


    let wordsToScore = getAllNewWords();
    if (wordsToScore.length===0) {
        document.getElementById("points").innerHTML = totalPoints;
        return totalPoints;
        }//no legal words

    
    for (word of wordsToScore) {
        totalPoints += wordScore(word);
    }
    if (rackEmpty("rack")) { totalPoints += 50;}

    return totalPoints;
}

function getlegalPositions(){
    let tiles = getTilesSubmitted();
    if (tiles.length===0) { return ["h8"];}

    let tile_ids = [];
    tiles.forEach((tile)=>{tile_ids.push(tile.id);})
    
    let allNeighbors = []
    for (id of tile_ids) {
        allNeighbors.push(neighbors(id));
    }
    allNeighbors=allNeighbors.flat();
    let notFilled = subtractArrays(allNeighbors,tile_ids);
    return getUniques(notFilled);

}

function neighbors(sq_id){//get the upper,lower,left and right neighbors of the slot

    let val = getSquareNumber(sq_id);
    let left = val-1;
    let right = val+1;
    let t = val-15;
    let b = val+15;
    if (val%15===1) {left=-1;}
    if (val%15===0) {right = -1;}
    if (val>210) {b = -1;}
    if (val<16) { t=-1;}
    // console.log(`${left}, ${right}, ${t}, ${b}`);
    let neighbors = [];
    for (x of [left, right, t, b]) {
        if (getCellAddress(x)!==null) { 
            neighbors.push(getCellAddress(x));
        }
    }
    return neighbors;
}

function sendTileBackToRack(space_id){
    //ignore empty squares and submitted tiles
    if (!checkNameOfLocation(space_id)) {return;}
    if (isEmptyOnBoard(space_id)) {return;}
    if (!document.getElementById(space_id).classList.contains("played-not-submitted")){return;}
    let towhere = findEmptyRackPosition();
    if (towhere!== null){ 
        move(space_id, towhere);
        displayScore();
    }
}

function returnToRack() {
    let tiles = getTilesPlayedNotSubmitted();
    if (tiles.length > 7 || tiles.length<1) {
        console.log(" no tiles or more than 7 tiles on board!");
        return;
    }
    
    for (tile of tiles){
        sendTileBackToRack(tile.id);
        }
    
    document.getElementById("points").innerHTML = 0;  
}

        
function moveRackToRack(rack1, rack2){
        let aSlots = getRackIds(rack1);
        let bSlots = getRackIds(rack2);
        for (let i=0;i<aSlots.length;i++){
            if(!isEmptyOnRack(aSlots[i])){
                move(aSlots[i],bSlots[i]);
            }
        }
}

let player = {
    name: '__', 
    number: 0,
    score: 0,
    get rackname(){
        return ("rack" + this.number);},
    // a way of computing an object property from other properties

    displayData: function() {  // Method which will display type of Animal
      console.log(`I am player ${this.name}, my number is ${this.number} and I have scored ${this.score} points`);
    },
    addPoints: function(points){
        this.score+=points;
    },

   /////TODO makerack()
   makeRack: function() {
       let rname = this.rackname;
       let pnum = this.number.toString();
       if (document.getElementById(rname)) {return;}
       let originalRack = document.getElementById("rack");
       let originalSlot = originalRack.children[0];
       let rack= document.createElement("div");
       let slot;
       rack.id = this.rackname;
       rack.classList.add("not-there");
       for (let n=1;n<8;n++){
           slot = originalSlot.cloneNode(true);
           slot.id = pnum+"s"+n.toString();
        //    console.log(`n=${n} and the slotid is ${slot.id}`)
           rack.appendChild(slot);
       }
       document.body.append(rack);
       if (!document.getElementById(rname)) { console.log("rack creation failed"); } 

   },

   removePieces: function(){
       if(!rackEmpty("rack")){
            moveRackToRack("rack",this.rackname);
       }
   },

   returnPieces: function(){
    if(!rackEmpty(this.rackname)){
        moveRackToRack(this.rackname,"rack");
        }
   }
   ///TODO returnpieces()

  };


  function createAIPlayer(NAME, NUMBER){
    let AI_player = Object.create(player);
    AI_player.name = NAME;
    AI_player.number =NUMBER;
    AI_player.score =0;

    AI_player.bestMove ={};
    AI_player.blank1 =[];
    AI_player.blank2 =[];
    AI_player.haveIwon=false;

    AI_player.resetBestMove = function(){
        this.bestMove["points"]=0;
        this.bestMove["from"]=[];
        this.bestMove["to"]=[];
        this.bestMove["blank1"]=[];
        this.bestMove["blank2"]=[];
    }

    // AI_player.trySingles = function(maxTries=maxWords){
    //     let rackIds = getRackIds("rack");
    //     let moves =0;
    //     for (let pos of legalPositions) {
    //         for (let rackId of rackIds){

    //             let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //             let stop =  false;
    //             if (readLetter(rackId)==="_"){
    //                 console.log("Blank tile!")
    //                 for (let i=0;i<26;i++){
    //                     changeLetter(rackId,alphabet[i]);
    //                     let curPoints = this.bestMove["points"];
    //                     this.try_move_no_blanks(rackId, pos);
    //                     if (this.bestMove["points"] > curPoints){
    //                         if (this.bestMove["blank1"].length===0)
    //                         {this.bestMove["blank1"] = [rackId, alphabet[i]];}
    //                         else {this.bestMove["blank2"] = [rackId, alphabet[i]];}
    //                         stop = true;
    //                         console.log(`Choosing ${alphabet[i]} for the blank tile`)
    //                     }
    //                     changeLetter(rackId,"_");	
    //                     if(stop) {break;}
    //                 }
    //             } else{
    //                 this.try_move_no_blanks(rackId, pos);
    //             }
    //             moves++;
    //             if (moves>maxTries || this.haveIwon){
    //                 // console.log(`${moves} max reached`)
    //                 return;
    //             }
    //         }
    //     }
    // }



    
    // // AI_player.try_move_no_blanks = function(rackId, pos){
    // //     this.placeCloneTiles(rackId, pos);
    // //     let tiles = getTilesPlayedNotSubmitted();
    // //     // if (checkLegalPlacement(tiles)){
    // //     if (allValidWords()){
    // //             let points = score();
    // //             if (points>this.bestMove["points"]){
    // //                 this.bestMove["from"]=[rackId];
    // //                 this.bestMove["to"] = [pos];
    // //                 this.bestMove["points"] = points;
    // //                 if (this.score+points>maxPoints){
    // //                     this.haveIwon=true;
    // //                 }
    // //             }
    // //         }
    // //     // }
    // //     // else{
    // //     //     //console.log(pos)
    // //     // }
        
    // //     this.removeCloneTiles();
    // // }





    // AI_player.placeCloneTiles = function(orig_id, dest_id){
    //     if (typeof(orig_id)!==typeof(dest_id)){return;}
        
    //     if ( !(typeof(orig_id)==="string" || Array.isArray(orig_id)))   {return;}
    //     if (typeof(orig_id) === "string"){
    //         if ( !isEmptyOnBoard(dest_id) ){return;}
    //         let origin = document.getElementById(orig_id);
    //         let tile = getTheTile(origin);
    //         let cloneTile = tile.cloneNode(true);
    //         cloneTile.removeAttribute("id");
    //         let dest = document.getElementById(dest_id);
    //         dest.appendChild(cloneTile);
    //         dest.classList.add('played-not-submitted');
    //         dest.classList.add('clone');
    //         return;
    //     }
    //     if (orig_id.length!== dest_id.length) {return;}

    //     for (let i=0;i<orig_id.length;i++) {
    //         this.placeCloneTiles(orig_id[i],dest_id[i]);
    //     }
        
        
    // }

    // AI_player.removeCloneTiles = function(){
    //     let cloneSpots=document.getElementsByClassName("clone");
    //     let pns=document.getElementsByClassName("played-not-submitted");
    //     if (cloneSpots.length===0 && pns.length===0) {return;}
         
    //     while (cloneSpots.length>0) {
    //             cloneTile = cloneSpots[0].children[0];
    //             cloneSpots[0].removeChild(cloneTile);
    //             cloneSpots[0].classList.remove("played-not-submitted");
    //             cloneSpots[0].classList.remove("clone");
    //         }
        
    //     let remcloneSpots=document.getElementsByClassName("clone");
    //     if (remcloneSpots.length !==0){console.log(`${remcloneSpots.length} clone spots not cleared`);}

    // }
        

    


    AI_player.ai_move = function(from_locs,to_locs,blank1=[],blank2=[]){
        if (typeof(from_locs)!==typeof(to_locs)){return;}
        if (typeof(from_locs) === "string"){
            move(from_locs,to_locs);
            return;
        }
        if (from_locs.length !== to_locs.length) {return;}

        for (let i=0;i<from_locs.length;i++) {
            move(from_locs[i], to_locs[i]);
        }
        
    }




    AI_player.playBestMove = function(){
        let from = this.bestMove["from"].flat();
        let to = this.bestMove["to"].flat();
        if (this.bestMove["blank1"].length !==0){
            changeLetter(this.bestMove["blank1"][0], this.bestMove["blank1"][1] );
        }
        if (this.bestMove["blank2"].length !==0){
            changeLetter(this.bestMove["blank2"][0], this.bestMove["blank2"][1] );
        }
        this.ai_move(from, to);
        // console.log(`found: ${readWord(this.bestMove["to"].flat())} for ${this.bestMove["points"]}`)
        this.resetBestMove();
        let aibox=document.getElementById("AIbox");
        aibox.classList.add("not-there");
    }


    AI_player.makeMove = async function(){

            
        let workerResult;
        // let workerResult = await try_n_tiles(maxWords, this.score, "worker.js");
        if (maxPoints-this.score<25) {
            workerResult = await try_n_tiles(maxWords, this.score, "worker.js");
        }

        else {
            const [res1, res2, res3] = await Promise.all([try_n_tiles(maxWords, this.score, "worker1.js"), try_n_tiles(maxWords, this.score, "worker2.js"),try_n_tiles(maxWords, this.score, "worker0.js")]);
            sortedres = [res1,res2,res3].sort((a,b)=>{return b.bestMove["points"]-a.bestMove["points"]});
            workerResult = sortedres[0];
        }
        
        if (workerResult.bestMove["points"]> this.bestMove["points"]){
            this.bestMove["to"]=workerResult.bestMove["to"];
            this.bestMove["from"]=workerResult.bestMove["from"];
            this.bestMove["points"]=workerResult.bestMove["points"];
            this.bestMove["blank1"]=workerResult.bestMove["blank1"];
            this.bestMove["blank2"]=workerResult.bestMove["blank2"];
            this.playBestMove();
            AI_playGotMove();
            return;     
        } else {
            console.log("got nothing from worker")
            }
        if (this.points === 0){
                console.log("Unable to find a move")
                let aibox=document.getElementById("AIbox");
                aibox.classList.remove("not-there");
                aibox.innerHTML = "AI failed to find a move - passing";
                pass(false);
                return;
            }
            this.playBestMove();
            AI_playGotMove();

    }

    
        

    AI_player.makeRack();
    AI_player.resetBestMove();
    return AI_player;
}



function createHumanPlayer(NAME, NUMBER){
    let playerH = Object.create(player);
    playerH.name = NAME;
    playerH.number =NUMBER;
    playerH.makeRack();
    return playerH;
}

function createPlayer(n){
    if (includes("AI_", playerNames[n-1])){
        players[n] = createAIPlayer(playerNames[n-1], n);
    } else {
        players[n] = createHumanPlayer(playerNames[n-1], n);
    }
}

function createPlayers(){
    let row;
    createPlayer(1);
    createPlayer(2);

    
    if (numPlayers ===3){
        createPlayer(3);
        row=document.getElementById("3rdrow");
        row.classList.remove("not-there");

    }

    if (numPlayers ===4){

        createPlayer(3);
        row=document.getElementById("3rdrow");
        row.classList.remove("not-there");

        createPlayer(4);
        row=document.getElementById("4throw");
        row.classList.remove("not-there");
    }
}

    


    function whoseMove(moveNumber,numPlayers){
        let player = moveNumber%numPlayers;
        player = (player === 0 ? numPlayers : player);
        // console.log(`It is the turn of player ${player}`);
        return player;
    }
    
    function returnToBag (space_id){
        if (!checkNameOfLocation(space_id)) {return;}//ignore invalid locations
        if (!includes("s", space_id)){return;}//only works for tiles on rack
        if (isEmptyOnRack(space_id)){return;}//empty slot

        let tile = getTileAt(space_id);
        let tile_id = tile.id;
        tile.removeAttribute('id');
        tile.classList.add("ghost");
        numberPattern = /\d+/g;
        letterPattern = /\D/g;
        nums = tile_id.match(numberPattern);
        letters = tile_id.match(letterPattern);
        newlist = [parseInt(nums[0]),letters[0], nums[1]];
        tilesArray.push(newlist);
        document.getElementById("tile-counter").innerHTML = tilesArray.length;
    }

    function returnAllToBag(slotlist) {//takes an array of numbers and returns those tiles to the bag
        
        //add checks that slotlist is ok
        if (!Array.isArray(slotlist) || !slotlist.length ===0){
            console.log("returnAllToBagrequires non-empty array")
            return;
        }

        slotnos = slotlist.map(String);
        space_ids =[];
        for (slot of slotlist){
            space_ids.push("s"+slot);
        }
        //checking to see if space_ids is a subset of rack ids
        let r=getRackIds("rack");
        if (!space_ids.every(element => r.includes(element))){
            console.log("rack slots to return from not a subset of slots of this rack")
            return;}

        for (id of space_ids){
            returnToBag(id);
        }

        
    }

    function whatsOnTheBoard(){
        let rows = generateRows();
        let cols = generateCols();
        let rackIds = getRackIds();
        let boardnrack={};

        for (row of rows){
            for (col of cols){
                let space_id=row+col.toString();
                if (!isEmptyOnBoard(space_id)){
                    boardnrack[space_id]=[readLetter(space_id),readPoint(space_id)];
                }
            }
        }

        for (rackId of rackIds){
            if (!isEmptyOnRack(rackId)){
                boardnrack[rackId]=[readLetter(rackId),readPoint(rackId)];
            }
        }

        return boardnrack;
    }


    function try_n_tiles(maxTries, cur_points=0, workerfile){

        return new Promise((resolve,reject)=>{

            let myWorker = new Worker(workerfile);
            let board = whatsOnTheBoard();
            let legalPositions=getlegalPositions();
            let tiles = getTilesPlayedNotSubmitted();
            let played_ids= getPlayedIds(tiles);
            tiles = getTilesSubmitted();
            let submitted_ids= getPlayedIds(tiles);
            let aibox=document.getElementById("AIbox");
            aibox.classList.remove("not-there");
           

            myWorker.postMessage([board, legalPositions, played_ids,submitted_ids,boosters, maxTries, cur_points, maxPoints]);

            //   myWorker.onmessage = function(event) {
            //     if (typeof(event.data)==="string"){
            //         // console.log("Message from worker:", event.data); 
            //         aibox.innerHTML = event.data;
            //     }
            // }
            myWorker.addEventListener('message', event => {
                let result = event.data;
                if (typeof(event.data)==="string"){
                    aibox.innerHTML = event.data;
                }
              }, false)
            


            myWorker.addEventListener('message', event => {
                let result = event.data;
                if (typeof(event.data)==="object"){
                    resolve(result); 
                }
              }, false)

        })


    }





    function exchangeLetters() {
        let onboard = getTilesPlayedNotSubmitted();
        if (onboard.length!==0) {returnToRack();}
        let toExStr  = prompt("Please indicate which tiles (1-7) to exchange: (e.g. 1,2,6)", "");
        if (toExStr==null) {return [];} 
        let toExArr = toExStr.split(",");
        for (num of toExArr){
            if (!isNumeric(num) || parseInt(num)<1 || parseInt(num)>7){return [];}
            }
        let toExArrUni= getUniques(toExArr); //remove duplicates
        returnAllToBag(toExArrUni);
        pass();

    }


    function  setBoardSize() {
        let n=85;
        let intViewportHeight = window.innerHeight;
        let u=document.getElementsByClassName("grid-container")[0];
        u.style.width = `${parseInt(intViewportHeight*n/100)}px`;
        u.style.height = `${parseInt(intViewportHeight*n/100)}px`;
        // console.log(`setBoardSize called new window size is ${intViewportHeight} and board is ${parseInt(intViewportHeight*n/100)}px `)
    }

    

    function showModalInfo(){
        let modal = document.getElementById("myModal");
        modal.style.display="block"
    }

    function closeMondalInfo(){
        let modal = document.getElementById("myModal");
        modal.style.display="none"
    }

    function showModal2lw(){
        let modal = document.getElementById("two-letter-modal");
        modal.style.display="block"
    }

    function closeMondal2lw(){
        let modal = document.getElementById("two-letter-modal");
        modal.style.display="none"
    }

    function startGame(){
        setBoardSize(85);
        createPlayers();
        updateScoreBoard();
        who= whoseMove(moveNumber,numPlayers);
        document.getElementById("who-is-playing").innerHTML=players[who].name;
        
        if (includes("AI_", players[who].name)) {
            replenishRack();
            AI_play();
        }
        else{
            alert(`Please pass to ${players[who].name}`); 
            replenishRack();
        }
        
    }



document.getElementById("shuffle").addEventListener("click", shuffle_rack);
document.getElementById("recall").addEventListener("click", returnToRack);
document.getElementById("play").addEventListener("click", play);
document.getElementById("checkdic").addEventListener("click", getWordToCheck);
document.getElementById("exchange").addEventListener("click", exchangeLetters);
document.getElementById("pass").addEventListener("click", pass);
document.getElementById("info").addEventListener("click", showModalInfo);
document.getElementById("closemodal").addEventListener("click", closeMondalInfo);
document.getElementById("2lw-list").addEventListener("click", showModal2lw);
document.getElementById("close2lw-list").addEventListener("click", closeMondal2lw);

window.addEventListener("resize", setBoardSize);
window.addEventListener("click", function (event){
    let modal = document.getElementById("myModal");
    let modal1 = document.getElementById("two-letter-modal");
    if (event.target == modal) {
        closeMondalInfo();
    }
    if (event.target == modal1) {
        closeMondal2lw();
    }
});

//double-click tile to return
let sqrs = document.getElementsByClassName("grid-item");
for (sqr of sqrs){
    sqr.addEventListener("dblclick", function(){//if there is a tile sitting there, send it back to the rack, otherwise do nothing
        if (this.children.length!==0){
            sendTileBackToRack(this.id);
        }
    });
}



//call function getWordToCheck upon pressing enter after entering text into search button, after suppressing default behavior for the enter button (keyCode 13)
let myform = document.getElementById("submittedWord");
myform.addEventListener('keypress',function(event){
    if(event.keyCode == 13) {
        event.preventDefault();
        getWordToCheck();
    }
});


startGame();





//TODO
/*  
- difficulty level for AI in the interface
- checkbox for AI
- 
- 
- 
- 
- 
-
*/

