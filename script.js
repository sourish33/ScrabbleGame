

let boosters = {};
(boosters = function fillBoosters() {
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
    })();


let legalPositions = getlegalPositions();
let moveNumber =1;
// let player1Name = sessionStorage.getItem("player1Name");
// let player2Name =sessionStorage.getItem("player2Name");
// let numPlayers = 2;
let settings = getSettings();
let dictionaryChecking = settings[0];
let randomize = settings[1];
let endgame = settings[2];

let playerNames = getPlayerNames();
let numPlayers  = playerNames.length;
if (randomize) {playerNames= shuffle(playerNames);}
let players = {};
let maxPoints =50000000;
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

function getRackIds(rackid) {//finds the rack element and grabs the ids of the slots
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



function move(fromWhere, toWhere) {

    let fromRack = includes("s", fromWhere);
    let toRack = includes("s", toWhere);
    let fromBoard = !includes("s", fromWhere);
    let toBoard = !includes("s", toWhere);


    let origin = document.getElementById(fromWhere);
    let destination = document.getElementById(toWhere);
    if (origin===destination){return;}
    if (origin==null || destination==null) {return;}
    let tile = getTheTile(origin);

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

    let tileAlreadyThere = getTheTile(destination);

    if (tileAlreadyThere != null) { 
        if (tileAlreadyThere.classList.contains("ghost"))
        //going back to the rack, a ghost tile should be discarded
            {
                destination.removeChild(tileAlreadyThere);	
            }
        else if (fromWhere[0]==="s" && toWhere[0]==="s")//mmoving tiles around on the rack, making tiles shift  to create space for the incoming tile
        {
            // console.log(`moving from ${fromWhere} to ${toWhere}`);
            // let ni=Math.min(...[fromWhere[1],toWhere[1]]);
            // let nf=Math.max(...[fromWhere[1],toWhere[1]]);
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
    
    for (slot of rackslots){
        slot.children[0].children[1].classList.add("centered-on-rack");
        slot.children[0].children[2].classList.add("bottom-right-on-rack");
        slot.children[0].setAttribute("ondrop", "onDropRackTile(event)");

        slot.children[0].children[1].classList.remove("centered");
        slot.children[0].children[2].classList.remove("bottom-right");
    }

    let tilesOnBoard = getTilesPlayedNotSubmitted();
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

function readWord(arr){
    let word =[];
    for (space_id of arr){
        let tile = getTileAt(space_id);
        let letter =tile.children[1].innerHTML;
        word.push(letter);
    }
    return word.join('');
}


function readPoints(arr){
    //reads off the point values of the letters of a word
    let points =[];
    for (space_id of arr){
        let tile = getTileAt(space_id);
        let point =tile.children[2].innerHTML;
        point = parseInt(point);
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

    function checkLegalPlacement(tiles){
        let cols = getPlayedCols(tiles);
        let rows = getPlayedRows(tiles);
        if (!(rows.length ===1 || cols.length ===1)) {
            console.log("letters submitted are not in the same row or col")
            return false;
        }

        if (getAllIslandWords().length!==0) {
            console.log("illegal words")
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
        alert(`Please pass to ${players[who].name}`);
        document.getElementById("who-is-playing").innerHTML=players[who].name;
        players[who].returnPieces();
        replenishRack();
        //reset the possible points 
        document.getElementById("points").innerHTML = 0;
        //update the list of legal positions
        legalPositions = getlegalPositions();
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
        document.getElementById("2lw-list").classList.add("not-there");
        document.getElementById("submittedWord").classList.add("not-there");
        document.getElementById("newgame").classList.remove("not-there");
        document.getElementById("cat-gif").classList.remove("not-there");
    }
}


function pass()
{
    let onboard = getTilesPlayedNotSubmitted();
    if (onboard.length!==0) {returnToRack();}

    let who= whoseMove(moveNumber,numPlayers);
    players[who].addPoints(score());
    players[who].removePieces();
    updateScoreBoard();

    //clear the search results
    let searchresult = document.getElementsByClassName("searchresult")[0];
    searchresult.innerHTML ="";
    //advance the movenumber
    moveNumber++;
    who= whoseMove(moveNumber,numPlayers);
    alert(`Please pass to ${players[who].name}`);
    document.getElementById("who-is-playing").innerHTML=players[who].name;
    players[who].returnPieces();
    replenishRack();
    //reset the possible points 
    document.getElementById("points").innerHTML = 0;
    //update the list of legal positions
    legalPositions = getlegalPositions();

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

// function highLightPlayer(){
//     let who= whoseMove(moveNumber,numPlayers);
//     let namid = "pl"+who;
//     // let scorid = "pl"+who;
//     let namcell = document.getElementById(namid).parentElement;
//     namcell.classList.add("highlight");
// }

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
    if (tiles.length===0) { return "h8";}

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

function createPlayers(){
    let row;
    let player1 = Object.create(player);
    player1.name = playerNames[0];
    player1.number =1;
    player1.makeRack();
    players[1] = player1;

    let player2 = Object.create(player);
    player2.name = playerNames[1];
    player2.number =2;
    player2.makeRack();
    players[2] = player2;

    
    if (numPlayers ===3){

        let player3 = Object.create(player);
        player3.name = playerNames[2];
        player3.number =3;
        player3.makeRack();
        players[3] = player3;
        row=document.getElementById("3rdrow");
        row.classList.remove("not-there");

    }

    if (numPlayers ===4){

        let player3 = Object.create(player);
        player3.name = playerNames[2];
        player3.number =3;
        player3.makeRack();
        players[3] = player3;
        row=document.getElementById("3rdrow");
        row.classList.remove("not-there");

        let player4 = Object.create(player);
        player4.name = playerNames[3];
        player4.number =4;
        player4.makeRack();
        players[4] = player4;
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

    // function gameAdvance() {
    //     let who= whoseMove(moveNumber,numPlayers);
    //     players[who].addPoints(score());
    //     players[who].removePieces();

    //     moveNumber++;
    //     who= whoseMove(moveNumber,numPlayers);
    //     players[who].returnPieces();
    //     replenishRack();

    // }




document.getElementById("shuffle").addEventListener("click", shuffle_rack);
document.getElementById("recall").addEventListener("click", returnToRack);
document.getElementById("play").addEventListener("click", play);
document.getElementById("checkdic").addEventListener("click", getWordToCheck);
document.getElementById("exchange").addEventListener("click", exchangeLetters);
document.getElementById("pass").addEventListener("click", pass);

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

createPlayers();
updateScoreBoard();
who= whoseMove(moveNumber,numPlayers);
alert(`Please pass to ${players[who].name}`);
document.getElementById("who-is-playing").innerHTML=players[who].name;
replenishRack();


//TODO
/*  
- 
- 
- 
- fix homepage bottom (scrolls down annoyingly)
- initial data page
- ending of the game
- animations
-use interact.js for drag and drop
*/

