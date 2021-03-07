

let boosters = fillBoosters();
let legalPositions = getlegalPositions();
let moveNumber =1;
let scoreboard = [];//stores strings with moves
let scoreBoardLength=10;//max number of previous moves to show
let gameOver = false //used to decide whether to save game upon unexpected exit
let settings = getSettings();
let dictionaryChecking = settings[0];
let randomize = settings[1];
let endgame = settings[2];
let AIlist={}
for (let n=1;n<5;n++){
    AIlist[n]=settings[3][n-1]
}

const passGreetings = ["Nice!", "Finally!", "Good Job!", "INCREDIBLE!", 
"Wowza!", "Woot Woot!", "That's LITERALLY awesome!", 
"Groovy!", "Righteous!", "Copacetic!", "Nifty!", "Quite a wordsmith there!"]



let playerNamesAndTypes= getPlayerNamesAndTypes()
let playerNames = Object.keys(playerNamesAndTypes)
let numPlayers  = playerNames.length;
if (randomize) {playerNames= shuffle(playerNames);}
let players = {};
let maxPoints =50000000;
let level = 2; //1:easy, 2:medium, 3:hard
if (endgame=="75pt") {maxPoints =75;}
if (endgame=="150pt") {maxPoints =150;}




let levels = [1500,60000,500000]
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

function randomUpTo(max) { // min and max included 
    let min=0;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }


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
    let AIList = JSON.parse(sessionStorage.getItem('AIList'));
    return ([dictcheck, toRandomize,end,AIList]);
}


function saveGame(verbose = false){
    //Only saves game variables necessary to restart an accidentally closed game. Assumes that the initialization variables are intact
    sessionStorage.setItem('board', JSON.stringify( whatsOnTheBoard() ))
    sessionStorage.setItem('hidnracks', JSON.stringify( whatsOnTheRacks() ))
    sessionStorage.setItem('players', JSON.stringify( players ))
    sessionStorage.setItem('scoreboard', JSON.stringify( scoreboard ))
    sessionStorage.setItem('moveNumber', moveNumber )
    let lptext=document.getElementById("lastPlayed").innerHTML
    sessionStorage.setItem('lptext', lptext )
    console.log("saved game")
    if (verbose){
        alert("Game saved in your browser")
    }
}

function retrieveSavedGame(){
    if(sessionStorage.getItem("board")==null || sessionStorage.getItem("players")==null || sessionStorage.getItem("moveNumber")==null)
    {
        console.log("Game not saved")
        return []
    }
    let board = JSON.parse(sessionStorage.getItem('board'))
    let hidnracks = JSON.parse(sessionStorage.getItem('hidnracks'))
    let players = JSON.parse(sessionStorage.getItem('players'))
    let scoreboard = JSON.parse(sessionStorage.getItem('scoreboard'))
    let mn = sessionStorage.getItem('moveNumber')
    let lptext = sessionStorage.getItem('lptext')
    return ([board,players, mn, lptext, scoreboard, hidnracks])
}

function savedGameExists(){
    return !(sessionStorage.getItem("board")==null)
}

function loadSavedGame(){
    if (!savedGameExists()) {return }
    if (!rackEmpty()){
        returnAllToBag()
    }
    const savedGame = retrieveSavedGame();
    if (savedGame.length===0){return}
    const board = savedGame[0];
    const plyrs = savedGame[1];
    const mn = savedGame[2];
    const lptext = savedGame[3];
    scoreboard = savedGame[4];
    const hidnracks = savedGame[5]

    //reset scores
    for (let n=1;n<Object.keys(plyrs).length+1;n++) {
        players[n].score = plyrs[n].score
    }
    //reset last played display
    document.getElementById("lastPlayed").innerHTML = lptext

    //reset move number
    moveNumber = mn

    

    //set the board
    let positions = Object.keys(board)
    let tiles = Object.values(board)
    let letters = []
    for (let tile of tiles){
        letters.push(tile[0])
    }
    for (let n=0;n<tiles.length;n++){
        placeTileWithLetterOnRack("1s1", letters[n])
        // console.log(`plaving the ${letters[n]} at ${positions[n]}`)
        move("1s1",positions[n])
    }
    let playedTiles = getTilesPlayedNotSubmitted();
    for (let tile of playedTiles) {
        tile.classList.remove("played-not-submitted");
        tile.classList.add("submitted");
        tile.setAttribute("ondragstart","return false");
        tile.classList.add("unselectable");
        tile.removeAttribute("ontouchstart");
        tile.removeAttribute("ontouchmove" );
        tile.removeAttribute("ontouchend");
        removeTouch(tile.children[0]);
    }
    legalPositions=getlegalPositions()
    updateScoreBoard()
    document.getElementById("lastPlayed").classList.remove("not-there")
}

function getPlayerNamesAndTypes(){ 
    let playerNamesAndTypes = {}
    for (let x of ["1","2","3","4"]){
        let pvar = `player${x}Name`;
        let theName = sessionStorage.getItem(pvar);
        if (theName !== "_"){ 
            playerNamesAndTypes[theName]=AIlist[x]}
    }
    return playerNamesAndTypes;
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




function onDragStart(event) {
    event
        .dataTransfer
        .setData('text/plain', event.target.id);
    }

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {
    let uu = event.currentTarget;
    let pos = getXY(uu)
    let destination = getSquareIdFromPos(pos)//calculating space_id from position of drop
    let incoming = event.dataTransfer.getData('text');
    let u = document.getElementById(incoming);
    if (u==null) {return;}//to prevent the error "cannot read parentelement of null"
    origin = u.parentElement.id;
    if (origin==="" || destination==="none") {return;}
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



let startingloc;
let endingloc;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
let lastMoved;
let multipleTouches = false;

window.addEventListener('touchstart', function(e) {
    // Invoke the appropriate handler depending on the 
    // number of touch points.
    if (e.touches.length>1) {
        multipleTouches=true
    }   
  }, false);

  window.addEventListener('touchend', function(e) {
    // Invoke the appropriate handler depending on the 
    // number of touch points.
        multipleTouches=false
    
  }, false);


function onTouchStart(e){

        if (multipleTouches){return}
        let u = e.currentTarget;
        let pos = getXY(u)
    
        startingloc = getSquareIdFromPos(pos)
        // console.log(`Starting location: ${startingloc}`)
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
}

function onTouchMove(e) {
    if (multipleTouches){return}
    e.preventDefault();
    let dragItem = e.currentTarget;
    lastMoved=dragItem;
      
    currentX = e.touches[0].clientX - initialX;
    currentY = e.touches[0].clientY - initialY;
    
    xOffset = currentX;
    yOffset = currentY;
  
    setTranslate(currentX, currentY, dragItem);

  }

  function onTouchEnd(e) {
    if (multipleTouches){return}
    initialX = currentX;
    initialY = currentY;
    let u = e.currentTarget;
    let pos = getXY(u)
    endingloc = getSquareIdFromPos(pos)
    xOffset=0;
    yOffset=0;
    setTranslate(0, 0, lastMoved)
    let emptySlotOnBoard = true;
    if (!includes("s",endingloc)){
        emptySlotOnBoard = isEmptyOnBoard(endingloc)
    }
    let locChanged = (startingloc!==endingloc)

    if (endingloc!=="none" && emptySlotOnBoard &&locChanged && !multipleTouches){
        move(startingloc,endingloc)
        // console.log(`Moved from: ${startingloc} to ${endingloc}` )
        displayScore();
    }
    
    startingloc = endingloc
 

  }

  function getSquareIdFromPos(pos){
      let x = pos[0]
      let y = pos[1]
      let whatshere = document.elementsFromPoint(x,y)
      if (whatshere.length===0) {return "none"} 
      for (stuffHere of whatshere){
          let stuff_id = stuffHere.id
          if (/^[^pqrtuvwxyz]\d+$/.test(stuff_id)) {return stuff_id}
      }
      return "none"
  }

  function getXY(space_id){
      let el;
      if (typeof(space_id)==="string"){
        el=document.getElementById(space_id);
      } else{
          el=space_id;
      }
      let rect = el.getBoundingClientRect();
      let posX = (rect.left+rect.right)/2;
      let posY = (rect.top+rect.bottom)/2;
      return ([posX, posY])
  }


  function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
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
    if (rack=== null) {return null}
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
                // console.log(`s${c}<->s${c+1}`);
                switchSpots(a,b);
            }
    } else if (ni>nf){
            for(let c=ni;c>nf;c--){
                let a = `s${c}`;
                let b = `s${c-1}`;
                // console.log(`s${c}<->s${c-1}`);
                switchSpots(a,b);
            }
    }

    return;
}

function checkNameOfLocation(loc) {
    let validOnScreenName = (/^[^pqrtuvwxyz]\d+$/.test(loc));
    let validOffScreenName = (/^(\d+[a-z]\d+)$/.test(loc));
    if (loc[0]==="s"){
        if (parseInt(loc.substr(1))>7) { 
          console.log(`${loc} is bad location for a move`)
          return false
          }
    }
    if (!validOffScreenName && !validOnScreenName) {
        console.log(`${loc} is bad location for a move`)
        return false
    }
    return true
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
        let newLetter  = prompt("Please choose a letter for this tile:", "");
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
        else {
            //spot on rack occupied by letter
            emptyOnRack = findEmptyRackPosition();
            move(fromWhere,emptyOnRack);
            move(emptyOnRack,toWhere);
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
    if (rackslots.length===0) {return;}
    
    for (slot of rackslots){
        if (slot.children.length ===0) {break;}
        if (slot.children[0].children[1]==null) {break;}
        slot.children[0].children[0].classList.add("tile-on-board")
        slot.children[0].children[1].classList.add("centered-on-rack");
        slot.children[0].children[2].classList.add("bottom-right-on-rack");
        slot.children[0].setAttribute("ondrop", "onDropRackTile(event)");

        slot.children[0].children[0].classList.remove("tile-on-rack");
        slot.children[0].children[1].classList.remove("centered");
        slot.children[0].children[2].classList.remove("bottom-right");
    }

    let tilesOnBoard = getTilesPlayedNotSubmitted();
    if (tilesOnBoard.length===0) {return;}
    for (tile of tilesOnBoard){
        slot.children[0].children[0].classList.remove("tile-on-rack")
        tile.children[0].children[1].classList.remove("centered-on-rack");
        tile.children[0].children[2].classList.remove("bottom-right-on-rack");
        tile.children[0].removeAttribute("ondrop");

        slot.children[0].children[0].classList.add("tile-on-board");
        tile.children[0].children[1].classList.add("centered");
        tile.children[0].children[2].classList.add("bottom-right");
    }
    // setFontSizes();

}

function placeTileOnRack(space_id){
    //pick a random tile from the bag and put it on the rack
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


    const showAIsRack = ()=>{
        document.getElementById("aisrack").style.display="flex"
        disableButtons()
    }
    const hideAIsRack = ()=>{
        document.getElementById("aisrack").style.display="None"
        enableButtons()
    }


    function replenishRack() {

        if (tilesArray.length ==0) {return;}
        let rackSlots = getRackIds("rack");
        for (slot of rackSlots){
            placeTileOnRack(slot);
        }

    }

    function hideRack(){
        // console.log("hiding rack")
        document.getElementById("rack").classList.add("ghost")
    }
    function showRack(){
        // console.log("showing rack")
        document.getElementById("rack").classList.remove("ghost")
    }

    function isEmptyOnRack(space_id){
        if (!checkNameOfLocation(space_id)) {return;}
        let space = document.getElementById(space_id);
        let tile = getTheTile(space);
        return tile.classList.contains("ghost") ? true : false;
    }

    function rackEmpty(rack_id="rack"){
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

function findTileWithLetter(letter){
    //returns the index of the first tile with that letter from the tilesArray, else -1
    let index=-1
    letter = letter.toUpperCase()
    ////TODO Fix this
    for (let n=0;n< tilesArray.length;n++){
        if (letter === tilesArray[n][1]){
            index=n
            break
        }
    }
    return index
}

function pickTileWithLetter(letter){
    let n = findTileWithLetter(letter)
    if (n===-1) {return []}
    return pickTileNumbered(n)
}

function pickTileNumbered(n) {//picks the n'th tile from the tile array
    if (tilesArray.length ==0) {return;}
    pickedTile = tilesArray.splice(n,1);
    document.getElementById("tile-counter").innerHTML = tilesArray.length;
    return pickedTile.flat();
}

function placeTileWithLetterOnRack(space_id, letter){
    //place a tile with a given letter on a rack space

    let pickedTile = pickTileWithLetter(letter);
    
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
    let who= whoseMove(moveNumber,numPlayers);
    let latestscore = `${players[who].name}: <span class=\"redbold\">${readWord(playedWord)}</span> for <span class=\"redbold\">${score()}</span>`
    scoreboard.push(latestscore)
    // console.log(scoreboard)
    let scoreString = makeScoreString(scoreboard, scoreBoardLength)
    // lw.innerHTML = `${players[who].name}: ${readWord(playedWord)} for ${score()} <br>`+lw.innerHTML;
    lw.innerHTML=scoreString
    lw.classList.remove("not-there");
    // console.log(`Played: ${wordsPlayed.join(', ')}`);
}

function makeScoreString(sb, lim=3) {
    let revscoreboard
    let sbcopy = Array.from(sb);//taking care to not reverse the original array
    if (sb.length>lim){
        revscoreboard = sbcopy.reverse().slice(0, lim);
    } else{
        revscoreboard = sbcopy.reverse(); 
    }
    let output=""
    for (el of revscoreboard){
      output+=`${el}<br>`
    }
    return output
  }

  function highlightPlayer(m){
      for (let n=1;n<5;n++){
        document.getElementById(`row${n}`).classList.remove("highlight")
      }
      document.getElementById(`row${m}`).classList.add("highlight")
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
        tile.setAttribute("ontouchstart","return");
        tile.setAttribute("ontouchmove","return" );
        tile.setAttribute("ontouchend", "return");
        removeTouch(tile.children[0]);
    }
    
    let gameCheck = endCheck();
    if (gameCheck===0)
    {
        //advance the movenumber
        moveNumber++;
        who= whoseMove(moveNumber,numPlayers);
  
        // document.getElementById("who-is-playing").innerHTML=players[who].name;
        highlightPlayer(who);
 
        players[who].returnPieces();
        replenishRack();
        saveGame()//saving the game
        makeAIRackUntouchable(who);
        //reset the possible points 
        document.getElementById("points").innerHTML = 0;
        //update the list of legal positions
        legalPositions = getlegalPositions();
        if (players[who].isAI) {
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
    showAIsRack();
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
    hideAIsRack();
}

function removeTouch(tile_container){
    tile_container.removeAttribute("ontouchstart");
    tile_container.removeAttribute("ontouchmove");
    tile_container.removeAttribute("ontouchend");
}



function restoreTouch(tile_container){
    tile_container.setAttribute("ontouchstart","onTouchStart(event)" )
    tile_container.setAttribute("ontouchmove","onTouchMove(event)" )
    tile_container.setAttribute("ontouchend","onTouchEnd(event)" )
}

function askToPass(player="next player"){
    hideRack()
        // alert(`Please pass to ${player}`);
        msg = `Please pass to ${player}`
        swal({
            title: `${passGreetings[randomUpTo(passGreetings.length-1)]}`,
            text: msg,
            icon: "success",
          }).then((value) => {
                    showRack();
          });
}

function askToPassMessage(player="next player", message="Better Luck Next Time!"){
    hideRack()
        // alert(`Please pass to ${player}`);
        msg = `Please pass to ${player}`
        swal({
            title: message,
            text: msg,
            icon: "success",
          }).then((value) => {
            showRack();
        });

    
}


function play(){//makes tiles stuck and animates new tiles when play button is pressed

    hideAIsRack()
    let tiles = getTilesPlayedNotSubmitted();
    if (tiles.length === 0) {return;} //nothing played yet
    if (!checkLegalPlacement(tiles)) {
        swal({
            title: "Uh oh!",
            text: "Tile placement illegal",
            icon: "error",
          });
        return;
    }

    if (dictionaryChecking) {
        let wordarray = readAllWords(getAllNewWords());
        let notAWords = checkIfLegal(wordarray);
        if (notAWords.length!==0){
            let msg =`${notAWords.join(", ")} not valid` ;
            swal({
                title: "Uh oh!",
                text: msg,
                icon: "error",
              });
            return;
        }
    }

    if (rackEmpty("rack")) { 
        document.getElementById("all7box").style.display="block";
    }

    let who= whoseMove(moveNumber,numPlayers);
    displayMove();
    players[who].addPoints(score());
    players[who].removePieces();
    updateScoreBoard();
    clearDict()

    
    

    for (tile of tiles) {
        tile.classList.remove("played-not-submitted");
        tile.classList.add("submitted");
        tile.setAttribute("ondragstart","return false");
        tile.classList.add("unselectable");
        tile.removeAttribute("ontouchstart");
        tile.removeAttribute("ontouchmove" );
        tile.removeAttribute("ontouchend");
        removeTouch(tile.children[0]);
    }

    saveGame()

    //is the game over?
    let gameCheck = endCheck();
    

    if (gameCheck===0)
    {
        //clear the search results
        let searchresult = document.getElementsByClassName("searchresult")[0];
        searchresult.innerHTML ="";
        //advance the movenumber
        moveNumber++;
        saveGame()
        who= whoseMove(moveNumber,numPlayers);
        // alert(`Please pass to ${players[who].name}`);
        
        if (!players[who].isAI) {
            // hideRack()
            // alert(`Please pass device to ${players[who].name}`);
            // console.log(`Please pass device to ${players[who].name}`);
            askToPass(`${players[who].name}`)
            
        }
        // document.getElementById("who-is-playing").innerHTML=players[who].name;
        highlightPlayer(who);
        players[who].returnPieces();
        replenishRack();
        makeAIRackUntouchable(who);
        //reset the possible points 
        document.getElementById("points").innerHTML = 0;
        //update the list of legal positions
        legalPositions = getlegalPositions();
        if (players[who].isAI) {
            showRack();
            AI_play();
        } else{
            // showRack();
            play();
        }
    }
    else {
        endGameSequence(gameCheck);
    }

}

function disableButtons(){
    document.getElementById("shuffle").disabled = true;
    document.getElementById("recall").disabled = true;
    document.getElementById("play").disabled = true;
    document.getElementById("exchange").disabled = true;
    document.getElementById("pass").disabled = true;
}

function enableButtons(){
    document.getElementById("shuffle").disabled = false;
    document.getElementById("recall").disabled = false;
    document.getElementById("play").disabled = false;
    document.getElementById("exchange").disabled = false;
    document.getElementById("pass").disabled = false;
}

function endGameSequence(n) {
    if (n===1){
        winner =getTopper()[0];
        }
    if (n===2){
        for (let i=1;i<numPlayers+1;i++) {
            players[i].endGameAdjust()
            updateScoreBoard()
        }
        winner =getTopper()[0];
    }
        document.getElementById("winner").innerHTML=winner;
        document.getElementById("play").classList.add("not-there");
        document.getElementById("victorybox").classList.remove("not-there");
        hideAIsRack()
        disableButtons();
        gameOver = true
}


function pass(confirmPass=true)
{
    if (confirmPass) {
        let confirmed = confirm("Are you sure you want to pass your turn?")
        if (!confirmed){return}
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
    saveGame()
    who= whoseMove(moveNumber,numPlayers);
    if (!players[who].isAI) {
        askToPassMessage(`${players[who].name}`)
    }
    // document.getElementById("who-is-playing").innerHTML=players[who].name;
    highlightPlayer(who);
    players[who].returnPieces();
    replenishRack();
    makeAIRackUntouchable(who);
    //reset the possible points 
    document.getElementById("points").innerHTML = 0;
    //update the list of legal positions
    legalPositions = getlegalPositions();
    if (players[who].isAI) {
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

// function decorateAI(n){
//     if (players[n].isAI){
//         document.getElementById(`pl${n}`).classList.add("AIPlayer")
//         document.getElementById(`pl${n}-points`).classList.add("AIPlayer")
//     }
// }


function updateScoreBoard(){
    document.getElementById("pl1").innerHTML = players[1].name;
    document.getElementById("pl1-points").innerHTML = players[1].score;
    // decorateAI(1);
    
    document.getElementById("pl2-points").innerHTML = players[2].score;
    document.getElementById("pl2").innerHTML = players[2].name;
    // decorateAI(2);

    if (numPlayers===3){
        document.getElementById("pl3-points").innerHTML = players[3].score;
        document.getElementById("pl3").innerHTML = players[3].name;
        // decorateAI(3);
    }
    if (numPlayers===4){
        document.getElementById("pl3-points").innerHTML = players[3].score;
        document.getElementById("pl3").innerHTML = players[3].name;
        // decorateAI(3);

        document.getElementById("pl4-points").innerHTML = players[4].score;
        document.getElementById("pl4").innerHTML = players[4].name;
        // decorateAI(4);
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
    if (rackEmpty("rack")) { 
        totalPoints += 50;
    }

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

function makeAIRackUntouchable(n){
    let rackIds = getRackIds()
    if (players[n].isAI){
        for (rackId of rackIds){
            let v =document.getElementById(rackId)
            v.setAttribute("ondragstart","return false");
            removeTouch(v.children[0])
        }
    } else {
        for (rackId of rackIds){
            let v =document.getElementById(rackId)
            v.setAttribute("ondragstart","onDragStart(event);");
            restoreTouch(v.children[0])
        }
        // enableTouchRack()

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
    endGameAdjust: function(){
        let r = ""//rack prefix, e.g. 1s1
        let toSubtract=0

        for (let n=1;n<8;n++){
            if (readPoint(`${this.number}s${n}`)!==undefined){
                toSubtract-=readPoint(`${this.number}s${n}`)
            }
        }
        this.addPoints(toSubtract)
        

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


  function createAIPlayer(NAME, NUMBER, LEVEL=2){
    let AI_player = Object.create(player);
    AI_player.name = NAME;
    AI_player.number =NUMBER;
    AI_player.max_words = levels[LEVEL-1];
    AI_player.isAI=true;
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


    AI_player.ai_move = function(from_locs,to_locs){
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
        if (maxPoints-this.score<25) {
            workerResult = await try_n_tiles(this.max_words, this.score, "worker.js");
        }

        else {
            const workerResults = await Promise.all([
                try_n_tiles(this.max_words, this.score, "worker7.js"), 
                try_n_tiles(this.max_words, this.score, "worker6.js"),
                try_n_tiles(this.max_words, this.score, "worker5.js"),
                try_n_tiles(this.max_words, this.score, "worker4.js"),
                try_n_tiles(this.max_words, this.score, "worker3.js"),
                try_n_tiles(this.max_words, this.score, "worker2.js"),
                try_n_tiles(this.max_words, this.score, "worker1.js")
            ]);
            sortedres = workerResults.sort((a,b)=>{return b.bestMove["points"]-a.bestMove["points"]});
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
    playerH.isAI=false;
    playerH.makeRack();
    return playerH;
}

function createPlayer(n){

    let playerLevel = playerNamesAndTypes[playerNames[n-1]]
    let playerName = playerNames[n-1]
   
    if (playerLevel!=="0"){
        players[n] = createAIPlayer(playerName, n, parseInt(playerLevel));
    } else {
        players[n] = createHumanPlayer(playerName, n);
    }
}

function createPlayers(){
    let row;

    createPlayer(1);
    createPlayer(2);

    
    if (numPlayers ===3){
        createPlayer(3);
        row=document.getElementById("row3");
        row.classList.remove("not-there");


    }

    if (numPlayers ===4){

        createPlayer(3);
        row=document.getElementById("row3");
        row.classList.remove("not-there");

        createPlayer(4);
        row=document.getElementById("row4");
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

    function returnAllToBag(slotlist=[1,2,3,4,5,6,7]) {//takes an array of numbers and returns those tiles to the bag
        
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

    function whatsOnTheRacks(){
        let allRackIds =[]
        let hidnrack={};
        for (let i=1;i<numPlayers+1;i++){
            console.log("rack"+i)
            allRackIds.push(getRackIds("rack"+i))
        }
        allRackIds=allRackIds.flat()
        for (rackId of allRackIds){
            if (!isEmptyOnRack(rackId)){
                hidnrack[rackId]=[readLetter(rackId),readPoint(rackId)];
            }
        }
        return hidnrack;
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


            myWorker.addEventListener('message', event => {
                let result = event.data;
                if (typeof(event.data)==="string"){
                    aibox.innerHTML = `AI: ${event.data}`;
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

    function returnExchangeTiles(){
        let toExArr = []
        let selectedTiles = document.getElementsByClassName("pushup")
        if (selectedTiles.length===0){return}
        [...selectedTiles].forEach(el => {

            num = el.id.slice(-1);
            toExArr.push(num)
        })
        closeexchangebox()
        returnSelected(toExArr)
    }



    function returnSelected(toExArr) {

        if (toExArr.length===0) {return}

       for (num of toExArr){
            if (!isNumeric(num) || parseInt(num)<1 || parseInt(num)>7){return [];}
            }
        let toExArrUni= getUniques(toExArr); //remove duplicates
        returnAllToBag(toExArrUni);
        pass(false);
    

    }

    function exchangeLetters(){
        let onboard = getTilesPlayedNotSubmitted();
        if (onboard.length!==0) {returnToRack();}
        let xch=document.getElementById("xch-modal")
        xch.style.display="block";
        
        let originalRack = document.getElementById("rack");
        let rackholder= document.getElementById("exchRackHolder")

        let clonedRack = originalRack.cloneNode(true)
        clonedRack.id = `rack5`

       for (let n=1;n<8;n++){
        let slot = clonedRack.children[n-1]
        slot.id = "5s"+n.toString();
        slot.children[0].id += "5s"
        slot.children[0].setAttribute("draggable","false")
        let getRidOf1 = ["ondrop", "ondragover", "ondragstart"]
        let getRidOf2 = ["ontouchstart","ontouchmove", "ontouchend"]
        for (let attrib of getRidOf1){
            slot.removeAttribute(attrib)
        }
        for (let attrib of getRidOf2){
            slot.children[0].removeAttribute(attrib)
        }
        slot.addEventListener("click", ()=>{
            let u=document.getElementById(slot.id)
            u.classList.toggle("pushup")
            //TODO: need to handle touch
        })
    }
        rackholder.append(clonedRack);
        hideRack()

        
    }


    function  setBoardSize() {
        let n=95;
        let w = window.innerWidth;
        let h = window.innerHeight;
        let ww=Math.min(w,h);
        if (ww>650){
          n=85;
        }
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('rack').style.display = 'block';
        let u=document.getElementsByClassName("grid-container")[0];
        u.style.display ='grid';
        u.style.width = `${parseInt(ww*n/100)}px`;
        u.style.height = `${parseInt(ww*n/100)}px`;
        // setFontSizes()
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
        clearResult()
        let modal = document.getElementById("two-letter-modal");
        modal.style.display="block"
    }

    function closeMondal2lw(){
        let modal = document.getElementById("two-letter-modal");
        modal.style.display="none"
        clearDict()
    }

    function closevictorybox(){
        let modal = document.getElementById("victorybox");
        modal.style.display="none"
    }

    function closeall7box(){
        let modal = document.getElementById("all7box");
        modal.style.display="none"
    }

    
    function closeexchangebox(){
        let modal = document.getElementById("xch-modal");
        modal.style.display="none"
        let rackholder= document.getElementById("exchRackHolder")
        rackholder.querySelectorAll('*').forEach(n => n.remove());
        showRack()
    }

    function startGame(){
        setBoardSize();
        createPlayers();
        let tilecontainers=document.getElementsByClassName("tile-container");
        for (tile of tilecontainers){
            tile.classList.add("ghost")
        }
        updateScoreBoard();
        if (savedGameExists()) {
            if (confirm("Load saved game?")) {
                loadSavedGame()
              } 
        }
        who= whoseMove(moveNumber,numPlayers);
        if (maxPoints<151){
            document.getElementById("maxpts").innerHTML=`${maxPoints} point game`;
        } else{
            document.getElementById("maxpts").innerHTML=`Till out of tiles`;
        }
        highlightPlayer(who);
        
        if (players[who].isAI) {
            replenishRack();
            makeAIRackUntouchable(who);
            AI_play();
        }
        else{
            let msg=`Please pass to ${players[who].name}` 

            swal({
                title: "Let the games begin!",
                text: msg,
                icon: "success",
              }).then((value) => {
                    replenishRack();
                });

            
        }
        
    }

    function exitGame(){
        gameOver=true
        sessionStorage.clear();
        console.log("exit game speaking")
    }



document.getElementById("shuffle").addEventListener("click", shuffle_rack);
document.getElementById("recall").addEventListener("click", returnToRack);
document.getElementById("play").addEventListener("click", play);
document.getElementById("cleardic").addEventListener("click", clearDict);
document.getElementById("exchange").addEventListener("click", exchangeLetters);
document.getElementById("pass").addEventListener("click", pass);
document.getElementById("info").addEventListener("click", showModalInfo);
document.getElementById("closemodal").addEventListener("click", closeMondalInfo);
document.getElementById("close-help").addEventListener("click", closeMondalInfo);
document.getElementById("2lw-list").addEventListener("click", showModal2lw);
document.getElementById("close2lw-list").addEventListener("click", closeMondal2lw);
document.getElementById("closevictorybox").addEventListener("click", closevictorybox);
document.getElementById("closexchbox").addEventListener("click", closeexchangebox);
document.getElementById("closeall7box").addEventListener("click", closeall7box);
document.getElementById("exchSubmit").addEventListener("click", returnExchangeTiles);
document.getElementById("exitgame").addEventListener("click", exitGame);
document.getElementById("savethegame").addEventListener("click", ()=>saveGame(true));



window.addEventListener('beforeunload', (event) => {
    // Cancel the event as stated by the standard.
    // if (!gameOver || moveNumber>1){
    //     saveGame()
    // }
    event.preventDefault();
    // Older browsers supported custom message
    event.returnValue = '';
  });

  window.addEventListener("unload", function(event) { 
    if (!gameOver && moveNumber>1){
        saveGame()
    }

});




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





let myform = document.getElementById("submittedWord");
myform.addEventListener('input', checknow)
//call function getWordToCheck upon pressing enter after entering text into search button, after suppressing default behavior for the enter button (keyCode 13)
//needed because pressing enter after entering a word causes the page to reload otherwise
// myform.addEventListener('keypress',function(event){
//     if(event.keyCode == 13) {
//         event.preventDefault();
//         // getWordToCheck();
//     }
// });




startGame();





//TODO
/*  
- Restart game button
- Save and restore game
- Save all the words found in a given turn and be able to pick from among them
- create frequency lists
- 
-
*/


