importScripts();


function readLetter(space_id){
    if (includes("s", space_id) && isEmptyOnRack(space_id)){return;}
    if (!includes("s", space_id) && isEmptyOnBoard(space_id)){return;}
    let tile = getTileAt(space_id);
    let letter =tile.children[1].innerHTML;
    return letter;
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





console.log("Hello I am the worker");


onmessage = function(e) {
    console.log('Message received from main script');
    board = e.data[0];
    legalPositions = e.data[1];
    played_ids = e.data[2];

    move("s1", "a15");
    move("s2", "a1");
    move("s3","o15");
    
    postMessage(board);
  }


