function permute(permutation) {
    var length = permutation.length,
        result = [permutation.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;
  
    while (i < length) {
      if (c[i] < i) {
        k = i % 2 && c[i];
        p = permutation[i];
        permutation[i] = permutation[k];
        permutation[k] = p;
        ++c[i];
        i = 1;
        result.push(permutation.slice());
      } else {
        c[i] = 0;
        ++i;
      }
    }
    return result;
  }
  
  
  function k_combinations(set, k) {
      var i, j, combs, head, tailcombs;
      
      // There is no way to take e.g. sets of 5 elements from
      // a set of 4.
      if (k > set.length || k <= 0) {
          return [];
      }
      
      // K-sized set has only one K-sized subset.
      if (k == set.length) {
          return [set];
      }
      
      // There is N 1-sized subsets in a N-sized set.
      if (k == 1) {
          combs = [];
          for (i = 0; i < set.length; i++) {
              combs.push([set[i]]);
          }
          return combs;
      }
      
      
      combs = [];
      for (i = 0; i < set.length - k + 1; i++) {
          // head is a list that includes only our current element.
          head = set.slice(i, i + 1);
          // We take smaller combinations from the subsequent elements
          tailcombs = k_combinations(set.slice(i + 1), k - 1);
          // For each (k-1)-combination we join it with the current
          // and store it to the set of k-combinations.
          for (j = 0; j < tailcombs.length; j++) {
              combs.push(head.concat(tailcombs[j]));
          }
      }
      return combs;
  }
  
  
  
  function combinations(set) {
      var k, i, combs, k_combs;
      combs = [];
      
      // Calculate all non-empty k-combinations
      for (k = 1; k <= set.length; k++) {
          k_combs = k_combinations(set, k);
          for (i = 0; i < k_combs.length; i++) {
              combs.push(k_combs[i]);
          }
      }
      return combs;
  }
  
  function anyCommonElements(arr1, arr2) { //same as anyCommonElements
    return arr1.some(item => arr2.includes(item)) 
} 

function arraysIsomorphic(array1, array2) {//returns true if arrays are isomorphic
	arr1=Array.from(array1);
	arr2 =Array.from(array2);
    arr1.sort();
    arr2.sort();//Since the only sorting needed is for letters and the strings s1...s7, the built-in sort is ok
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
	}
	return true;
}

function arraysExactlyEqual(array1, array2) {//returns false if the ordering of elements is different
	arr1=Array.from(array1);
	arr2 =Array.from(array2);
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
	}
	return true;
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

function shuffle(arr){

    let L = arr.length -1;
    let sarr = Array.from(arr);//cannot use = cuz JS passes by reference in rupa case

    for(let i = L; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = sarr[i];
        sarr[i] = sarr[j];
        sarr[j] = temp;
    }
    return sarr;
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

function arrayRemove(arr, value) { //removes value from array
    return arr.filter(function(element){ return element != value; });
   }

function subtractArrays(arr1,arr2){
    return arr1.filter(value => !arr2.includes(value));
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

function findHorSlots(row, n){/////////////////WORKING ON rupa///////////////////////////////////

	//legalPositions and played_ids and cols available as globals

	let slotList=[];
	for (let i=1;i<15-n+2;i++){
		let slot =[];
		for (let j=0;j<n;j++){
			let space_id = row+(i+j).toString();

			slot.push(space_id);
		}
		let containsAtLeastOneLegalSlot = anyCommonElements(slot,legalPositions);
		let overlapsSubmitted =  anyCommonElements(slot,submitted_ids);
		if (containsAtLeastOneLegalSlot && !overlapsSubmitted){
			slotList.push(slot);
		}

	}
	// slotList = slotList.filter(item => (checkLegalitySingleSlot(item)) );

	return slotList;
}

function findHorGapSlots(row, n){

	let slotList=[];
	for (let i=1;i<15-n+2;i++){
		let slot =[];
		let containsSubmitted =false;
		let toJumpOver = [];
		for (let j=0;j<n;j++){
			let space_id = row+(i+j).toString();
			if (submitted_ids.includes(space_id)) {
				containsSubmitted = true;
				toJumpOver.push(space_id);
			}
			slot.push(row+(i+j).toString());
		}

		if (containsSubmitted){
			slot = subtractArrays(slot, toJumpOver);
			let containsAtLeastOneLegalSlot = anyCommonElements(slot,legalPositions);
			let overlapsSubmitted =  anyCommonElements(slot,submitted_ids);
			if (containsAtLeastOneLegalSlot && !overlapsSubmitted){
				slotList.push(slot);
			}
		}
	}

	// slotList = slotList.filter(item => (checkLegalitySingleSlot(item)) );

	return slotList;
}


function findVerSlots(col, n){

	let slotList=[];
	for (let i=0;i<15-n+1;i++){
		let slot =[];
		let containsSubmitted =false;
		for (let j=0;j<n;j++){
			let space_id = rows[i+j]+col.toString();
			slot.push(space_id);
		}
		let containsAtLeastOneLegalSlot = anyCommonElements(slot,legalPositions);
		let overlapsSubmitted =  anyCommonElements(slot,submitted_ids);
		if (containsAtLeastOneLegalSlot && !overlapsSubmitted){
			slotList.push(slot);
		}
	}
	// slotList = slotList.filter(item => (checkLegalitySingleSlot(item)) );
	return slotList;
}

function findVerGapSlots(col, n){

	let slotList=[];
	let rows = generateRows();
	for (let i=0;i<15-n+1;i++){
		let slot =[];
		let containsSubmitted =false;
		let toJumpOver = [];
		for (let j=0;j<n;j++){
			let space_id = rows[i+j]+col.toString();
			
			if (submitted_ids.includes(space_id)) {
				containsSubmitted = true;
				toJumpOver.push(space_id);
			}
			slot.push(space_id);
		}
		// if (containsSubmitted){
		// 	gapSlot = subtractArrays(slot, toJumpOver);
		// 	if( checkLegalitySingleSlot(gapSlot)){slotList.push(gapSlot);}
		// }
		if (containsSubmitted){
			slot = subtractArrays(slot, toJumpOver);
			let containsAtLeastOneLegalSlot = anyCommonElements(slot,legalPositions);
			let overlapsSubmitted =  anyCommonElements(slot,submitted_ids);
			if (containsAtLeastOneLegalSlot && !overlapsSubmitted){
				slotList.push(slot);
			}
		}
	}
	// slotList = slotList.filter(item => (checkLegalitySingleSlot(item)) );
	return slotList;
}

//////************************TO Fix********************************************* */
function findAllHorSlotsOfLength(n) {
	let allSlots =[];
	let rows = [];

    for (pos of legalPositions){
		rows.push(pos[0]);
		rows = getUniques(rows);
	}

	for (row of rows){
		let horSlots = findHorSlots(row, n);
		for (horSlot of horSlots){
			if (anyCommonElements(legalPositions, horSlot)) { allSlots.push(horSlot);}
		}
	}

	return allSlots;
}

function findAllVerSlotsOfLength(n) {
	let allSlots =[];
	let cols = [];

    for (pos of legalPositions){
		cols.push(parseInt(pos.substr(1)));
		cols = getUniques(cols);
	}

	for (col of cols){
		let vslots = findVerSlots(col, n);
		for (vslot of vslots){
			if (anyCommonElements(legalPositions, vslot)) { allSlots.push(vslot);}
		}
	}

	return allSlots;
}

function getAllHorGapSlots(){
	let allSlots =[];
	let rows = [];

    for (pos of legalPositions){
		rows.push(pos[0]);
		rows = getUniques(rows);
	}
	for (let row of rows){
		for (let i=3;i<8;i++) {
			gapslot = findHorGapSlots(row, i);
			let len = gapslot.length;
			if (len>1){
				allSlots.push(gapslot);
			}
		}
	}
	allSlots = allSlots.flat();
	return sortSlotsByLength(allSlots);
}

function getAllVerGapSlots(){
	let allSlots =[];
	let cols = [];

    for (pos of legalPositions){
		cols.push(parseInt(pos.substr(1)));
		cols = getUniques(cols);
	}

	for (let col of cols){
		for (let i=3;i<8;i++) {
			gapslot = findVerGapSlots(col, i);
			let len = gapslot.length;
			if (len>1){
				allSlots.push(gapslot);
			}
		}
	}
	allSlots = allSlots.flat();
	return sortSlotsByLength(allSlots);
}

function sortSlotsByLength(slots) {
	let sortedslots ={};
	for (let i=2;i<8;i++){
		sortedslots[i]=[];
	}
	for (let i=2;i<8;i++){
		for (let slot of slots){
			if (slot.length === i){
				sortedslots[i].push(slot);
			}
		}
	}

	return sortedslots;
}


function getAllSlotsSortedByLen(){
	let sortedslots ={};
	let allHorGapSlots = getAllHorGapSlots();
	let allVerGapSlots = getAllVerGapSlots();
	for (let i=2;i<8;i++){
		sortedslots[i]=[];
	}
	for (let i=2;i<8;i++){
		let allhorslots = findAllHorSlotsOfLength(i);
		let horgapslots = allHorGapSlots[i];
		let Hslots=mergeWithoutDuplication(allhorslots,horgapslots);
		let allverslots = findAllVerSlotsOfLength(i);
		let vergapslots = allVerGapSlots[i];
		let Vslots=mergeWithoutDuplication(allverslots,vergapslots);
		sortedslots[i].push(Hslots);
		sortedslots[i].push(Vslots);
		sortedslots[i]=prioritySort(sortedslots[i].flat());
	}

	return sortedslots;
}

function alreadyContains(s, slots){
	for(let slot of slots){
		if (arraysIsomorphic(slot, s)){return true;}
	}
	return false;
}

function alreadyContainsExact(s, slots){
	for(let slot of slots){
		if (arraysExactlyEqual(slot, s)){return true;}
	}
	return false;
}

function mergeWithoutDuplication(slots1, slots2) {
	if (slots1.length===0) {return slots2;}
	if (slots2.length===0) {return slots1;}
	let long, short;
	if (slots1.length > slots2.length){
		long = Array.from(slots1);
		short = Array.from(slots2);
	} else {
		short = Array.from(slots1);
		long = Array.from(slots2);

	}
	for (let s of short){
		if (!alreadyContains(s, long)) {long.push(s)}
	}
	return long;
}

function removeDuplicates(v) {
	let nodup = [];
	for (el of v){
		if (!alreadyContainsExact(el, nodup)) {
		  nodup.push(el)
	  	}
	  }
	return nodup;
}

function allValidWords(){
	let words = readAllWords(getAllNewWords());
	for (let word of words){
		if (!checkDict(word)) {return false}
	}
	return true;
}

function hasLetters(slot,which="all"){
	let letterList = getLettersOnSquare(slot);
	if (which==="all"){
		if(anyCommonElements(letterList,["TL","DL","TW","DW"])){
			return true;
		}
			return false;
	}
	else{
		if (letterList.includes(which)){
			return true;
		}
			return false;
	}
		
}

function prioritySort(slotArray){
	let sArray = Array.from(slotArray);
	let TW =[];
	let DW=[];
	let TL=[];
	let DL=[];
	for (slot of sArray){
		if (hasLetters(slot, "TW")){
			TW.push(slot);
			continue;
		}	
		if (hasLetters(slot, "DW")){
			DW.push(slot);
			continue;
		}	
		if (hasLetters(slot, "TL")){
			TL.push(slot);
			continue;
		}
		if (hasLetters(slot, "DL")){
			DL.push(slot);
			continue;
			}	
	}

	let goodSlots = TW.concat(DW).concat(TL).concat(DL);
	let nogoodSlots = subtractArrays(sArray,goodSlots);

	sArray = goodSlots.concat(nogoodSlots);
	// if (sArray.length!==slotArray.length){
	// 	console.log("Ooops!!!!!! prioritySort failed")
	// }
	return sArray;
}

function getAllRackPermutations(n){//permutes the tiles without duplication, i.e, LOOK would be counted only once
	let letters =[];
	rackIds.forEach(el=>{ letters.push(readLetter(el)); });
	let perms = unique_k_perms(letters,n);
	let rackperms =[]
	for (let perm of perms){
		let rperm = [];
		for (let el of perm){
			let indices = getLocsInArray(letters, el);
			if (indices.length===1) {
				rperm.push(rackIds[indices[0]]);
			}
			else {
				 for (index of indices){
					if (!rperm.includes(rackIds[index])) {
						rperm.push(rackIds[index]);
						break;
             		}
         		}
				  
			}
		}
		rackperms.push(rperm);
	}
	return rackperms;

}

function getLocsInArray(arr, windex){//returns indices of the element windex in arr
	let result =[];
	arr.forEach((el, index) => el === windex ? result.push(index) : null)
	return result;
  }

function unique_k_perms(rackIds,n){

	combs = k_combinations(rackIds,n);
	perms = []
	for (comb of combs){
		perms.push(permute(comb));
	}
	perms= perms.flat();

	return removeDuplicates(perms);
}






//////////////////////*********************************** */
function getHorWords(row) {//finds all 2-letter and higher words in row (e.g "a" or "h")

    let wordbag = [];
    let word =[];

    for (let i =1; i<16; i++) {
        let curloc = row+i.toString();
        if (board[curloc] ==null) {
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

function getAllHorWords(){
    
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

function score(allLetters = false){//find the scores of all the words in the list

    let wordsToScore = getAllNewWords();
    let totalPoints=0;

    for (word of wordsToScore) {
        totalPoints += wordScore(word);
    }
    let rackslots=occupiedSpacesInRow("s");

    if (allLetters) { totalPoints += 50;}

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
    // return board;
}

function placeCloneTiles(from, to){

    if (typeof(from) === "string"){
        let tile = board[from];
        let cloneTile = Array.from(tile);
        cloneTile.push("clone");
        board[to] = cloneTile;
        played_ids.push(to);
        return;
    }
    else {
        for (let i=0;i<from.length;i++) {
            placeCloneTiles(from[i],to[i]);
        }
    }

    //TODO: remember to update tilesPlayedNotSubmitted
}

function removeCloneTiles(from, to){
    let ids = Object.keys(board);

    for (id of ids){
        if (board[id].length>2) {
            delete board[id];
            played_ids=arrayRemove(played_ids, id);
        }
        
    }
    //TODO: remember to update tilesPlayedNotSubmitted
}

function createAIPlayer(){
    let AI_player = {};
    AI_player.score =0;

    AI_player.bestMove ={};
    AI_player.bestMove["from"]=[];
    AI_player.bestMove["to"] = [];
    AI_player.bestMove["points"] = 0;
    AI_player.bestMove["blank1"] = [];
    AI_player.bestMove["blank2"] = [];
    AI_player.haveIwon=false;
    return AI_player;
}

function try_move_no_blanks(rackId, pos){
    // if (!isArray(rackId)) { rackId=[rackId]}
    // if (!isArray(pos)) { pos=[pos]}
    placeCloneTiles(rackId, pos);
    allTiles = (rackId.length===7? true : false);


    if (allValidWords()){
            let points = score(allTiles);
            if (points>rupa.bestMove["points"]){
                if (typeof(rackId)==="string"){rackId=[rackId]};
                if (typeof(pos)==="string"){pos=[pos]};
                rupa.bestMove["from"]=rackId;
                rupa.bestMove["to"] = pos;
                rupa.bestMove["points"] = points;
                if (rupa.score+points>maxPoints){
                    rupa.haveIwon=true;
                }
            }
        }
    removeCloneTiles();
}

function tryNletters(n, maxTries){
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let rackPerms = getAllRackPermutations(n);
    let legalSlots =  getAllSlotsSortedByLen()[n]
    // console.log(`rackperms: ${rackPerms.length}, legalSlots = ${legalSlots.length}, to try: ${rackPerms.length*legalSlots.length}`)
    // console.log(`Starting ${n}-letter words`)
    let blankspots=[];
    let stop = false;
    for (rackId of rackIds){
        if (readLetter(rackId)=="_"){
            blankspots.push[rackId];
        }
    }
    let blank1 ="";
    let blank2 ="";
    switch (blankspots.length) {
        case 0:
            break;
        case 1:
            blank1 = blankspots[0];
        case 2:
            blank1 = blankspots[0];
            blank2 = blankspots[1];

        default:
            break;
    }
    let moves =0;
    loop1:
    for (let pos of legalSlots) {
        loop2:
        for (let rackPerm of rackPerms){
            if (blankspots.length===2 && rackPerm.includes(blank1) && rackPerm.includes(blank2)){//ignore xombos with both blankers
                break loop2;
            }


            if (rackPerm.includes(blank1)) {
                // console.log("Blank tile!")
                for (let i=0;i<alphabet.length;i++){
                    changeLetter(blank1,alphabet[i]);
                    let curPoints = rupa.bestMove["points"];
                    try_move_no_blanks(rackPerm, pos);
                    moves++;
                    if (rupa.bestMove["points"] > curPoints){
                        rupa.bestMove["blank1"] = [blank1, alphabet[i]]; 
                        stop = true;
                        }
                    }
                    changeLetter(blank1,"_");
                    // console.log(`Choosing ${alphabet[i]} for blank tile`);	
                    if(stop) {break;}
                    
                }
                if (rackPerm.includes(blank2)) {
                    // console.log("Blank tile!")
                    for (let i=0;i<alphabet.length;i++){
                        changeLetter(blank2,alphabet[i]);
                        let curPoints = rupa.bestMove["points"];
                        try_move_no_blanks(rackPerm, pos);
                        moves++;
                        if (rupa.bestMove["points"] > curPoints){
                            rupa.bestMove["blank2"] = [blank2, alphabet[i]]; 
                            stop = true;
                            }
                        }
                        changeLetter(blank2,"_");	
                        // console.log(`Choosing ${alphabet[i]} for blank tile`);
                        if(stop) {break;}
                    }
        
            

             else{
            
                    try_move_no_blanks(rackPerm, pos);
                    moves++;
                    removeCloneTiles();
                
            }
            
            if (moves>maxTries || rupa.haveIwon){
                // console.log(`${moves} max reached for ${n}-letter words`);
                //break loop1;
                return;
            }
        }

    }
}


function trySingles(maxTries=maxWords){

    let moves =0;
    for (let pos of legalPositions) {
        for (let rackId of rackIds){

            let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let stop =  false;
        
            if (readLetter(rackId)==="_"){
                console.log("Blank tile!")
                for (let i=0;i<26;i++){
                    changeLetter(rackId,alphabet[i]);
                    let curPoints = rupa.bestMove["points"];
                    try_move_no_blanks(rackId, pos);
                    if (rupa.bestMove["points"] > curPoints){
                        rupa.bestMove["blank1"] = [rackId, alphabet[i]];
                        stop = true;
                        // console.log(`Choosing ${alphabet[i]} for the blank tile`)
                    }
                    changeLetter(rackId,"_");	
                    if(stop) {break;}
                }
            } else{
                try_move_no_blanks(rackId, pos);
            }
            moves++;
            if (moves>maxTries || rupa.haveIwon){
                // console.log(`${moves} max reached`)
                return;
            }
        }
    }
}



