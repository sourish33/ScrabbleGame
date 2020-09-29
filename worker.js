importScripts();


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

function getUniques(arr){//returns unique elements in an array
    return Array.from(new Set(arr));
}



function readLetter(space_id){
    return board[space_id][0];
}

function readPoint(space_id){
    return board[space_id][1];
}

function changeLetter(space_id, letter){

    board[space_id][0]=letter;
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

function readWord(arr){
    let word =[];
    for (space_id of arr){
        let letter = readLetter(space_id)
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

function findAdjCols(arr) {///////https://stackoverflow.com/questions/26675688/best-way-to-group-adjacent-array-items-by-value
    ///group adjacent numbers
    var result = arr.reduce(function(prev, curr) {
        if (prev.length && curr === prev[prev.length - 1].slice(-1)[0]+1) {
            prev[prev.length - 1].push(curr);
        }
        else {
            prev.push([curr]);
        }
        return prev;
    }, []);
    return result;
}


function findAdjRows(arr) {
    /////group adjacent letters
    var result = arr.reduce(function(prev, curr) {
        if (prev.length && curr.charCodeAt(0) === prev[prev.length - 1].slice(-1)[0].charCodeAt(0)+1) {
            prev[prev.length - 1].push(curr);
        }
        else {
            prev.push([curr]);
        }
        return prev;
    }, []);
    return result;
    }

function occupiedSpacesInRow(row){
    let spaces = Object.keys(board);
    let sq_ids =[];
    for (space of spaces){
        if (includes(row, space)){
            sq_ids.push(space);
        }
    }
    return sq_ids;
}

function getHorWords(row) {//finds all 2-letter and higher words in row (e.g "a" or "h")

    let sq_ids = occupiedSpacesInRow(row);


    let cols = [];
    for (id of sq_ids){
      cols.push( parseInt(id.substr(1)) );
    }
    grouped_cols = findAdjCols(cols);
    let wordbag =[];
    for (col of grouped_cols){
      word =[]
      for (el of col){
        el =row+el.toString();
        word.push(el);
      }
      wordbag.push(word)
    }

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
        if (board[curloc] ==null)  {
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
    
    
    let rows =[];
    for (id of played_ids){
        rows.push(id[0])
    }
    rows = getUniques(rows);
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
    let cols =[];
    for (id of played_ids){
        cols.push(id.substr(1))
    }
    cols = getUniques(cols);
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

function score(){//find the scores of all the words in the list

    let wordsToScore = getAllNewWords();
    let totalPoints=0;

    for (word of wordsToScore) {
        totalPoints += wordScore(word);
    }
    let rackslots=occupiedSpacesInRow("s");

    if (rackslots.length===0) { totalPoints += 50;}

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
    
        if ( submitted_ids.includes(sq_id)    ) {
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
    submitted_ids = e.data[3];
    boosters = e.data[4];

    let p = score();
    // let r = readAllWords(getAllNewWords())

    postMessage(p);
  }


