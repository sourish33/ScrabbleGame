importScripts();


function readLetter(space_id){
    return board[space_id][0];
}

function readPoint(space_id){
    return board[space_id][1];
}

function changeLetter(space_id, letter){

    board[space_id][0]=letter;
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

function getAllHorWords(){///////////////////TODO//////////////////////////

    //played_ids available as a global
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


function move(from, to){
    let tile = board[from];
    board[to] = tile;
    delete board[from];
    return board;
}

function placeCloneTiles(from, to){
    //TODO: remember to update tilesPlayedNotSubmitted
}

function removeCloneTiles(from, to){
    //TODO: remember to update tilesPlayedNotSubmitted
}





console.log("Hello I am the worker");


onmessage = function(e) {
    console.log('Message received from main script');
    board = e.data[0];
    legalPositions = e.data[1];
    played_ids = e.data[2];

    move("s1", "a15");
    r=readLetter("s4");
    changeLetter("s4","_");
    rr = readLetter("s4");

    
    postMessage([r,rr]);
  }


