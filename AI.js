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




function highlightBoxes(arr,flush=true){//puts dark borders around the slots specified in array
	if (flush) {clearBoxes();}
	for (el of arr) {
		let u = document.getElementById(el);
		u.classList.add("highlight-box");
	}
}

function findCommonElements(arr1, arr2) { //same as findCommonElements
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

function clearBoxes(){//removes any dark borders
	let arr = document.getElementsByClassName("highlight-box");
	if (arr.length ===0) {return;}
	Array.from(arr).forEach(element => {
			element.classList.remove("highlight-box");
	});
}

// function findCommonElements(arr1,arr2){
// 	let overlaps =  arr1.filter(x => arr2.includes(x));
// 	return (overlaps.length>0);
// }

function findHorSlots(row, n){
	if (typeof legalPositions === 'undefined' || legalPositions === null){
		let legalPositions= getlegalPositions();
	}
	let playedTiles=getPlayedIds(getTilesSubmitted());
	// let cols =[];
    // legalPositions.forEach((pos)=>{cols.push(pos.substring(1));})
	// cols = getUniques(cols);
	cols=generateCols();
	let slotList=[];
	for (let i=1;i<15-n+2;i++){
		let slot =[];
		for (let j=0;j<n;j++){
			let space_id = row+(i+j).toString();

			slot.push(space_id);
		}
		let containsAtLeastOneLegalSlot = findCommonElements(slot,legalPositions);
		let overlapsSubmitted =  findCommonElements(slot,playedTiles);
		if (containsAtLeastOneLegalSlot && !overlapsSubmitted){
			slotList.push(slot);
		}

	}
	// slotList = slotList.filter(item => (checkLegalitySingleSlot(item)) );

	return slotList;
}



function findHorGapSlots(row, n){
	if (typeof legalPositions === 'undefined' || legalPositions === null){
		let legalPositions= getlegalPositions();
	}
	let playedTiles=getPlayedIds(getTilesSubmitted());
	cols=generateCols();
	let slotList=[];
	for (let i=1;i<15-n+2;i++){
		let slot =[];
		let containsSubmitted =false;
		let toJumpOver = [];
		for (let j=0;j<n;j++){
			let space_id = row+(i+j).toString();
			if (document.getElementById(space_id).classList.contains("submitted")) {
				containsSubmitted = true;
				toJumpOver.push(space_id);
			}
			slot.push(row+(i+j).toString());
		}

		if (containsSubmitted){
			slot = subtractArrays(slot, toJumpOver);
			let containsAtLeastOneLegalSlot = findCommonElements(slot,legalPositions);
			let overlapsSubmitted =  findCommonElements(slot,playedTiles);
			if (containsAtLeastOneLegalSlot && !overlapsSubmitted){
				slotList.push(slot);
			}
		}
	}

	// slotList = slotList.filter(item => (checkLegalitySingleSlot(item)) );

	return slotList;
}

function findVerSlots(col, n){
	if (typeof legalPositions === 'undefined' || legalPositions === null){
		let legalPositions= getlegalPositions();
	}
	let slotList=[];
	let playedTiles=getPlayedIds(getTilesSubmitted());
	let rows = generateRows();
	for (let i=0;i<15-n+1;i++){
		let slot =[];
		let containsSubmitted =false;
		for (let j=0;j<n;j++){
			let space_id = rows[i+j]+col.toString();
			slot.push(space_id);
		}
		let containsAtLeastOneLegalSlot = findCommonElements(slot,legalPositions);
		let overlapsSubmitted =  findCommonElements(slot,playedTiles);
		if (containsAtLeastOneLegalSlot && !overlapsSubmitted){
			slotList.push(slot);
		}
	}
	// slotList = slotList.filter(item => (checkLegalitySingleSlot(item)) );
	return slotList;
}

function findVerGapSlots(col, n){
	if (typeof legalPositions === 'undefined' || legalPositions === null){
		let legalPositions= getlegalPositions();
	}
	let slotList=[];
	let playedTiles=getPlayedIds(getTilesSubmitted());
	let rows = generateRows();
	for (let i=0;i<15-n+1;i++){
		let slot =[];
		let containsSubmitted =false;
		let toJumpOver = [];
		for (let j=0;j<n;j++){
			// if ((i+j)>rows.length){console.log(`i=${i} and j=${j}`)};//DEBUG LINE
			let space_id = rows[i+j]+col.toString();
			// console.log(`space_id is ${space_id}`);//DEBUG LINE
			if (document.getElementById(space_id).classList.contains("submitted")) {
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
			let containsAtLeastOneLegalSlot = findCommonElements(slot,legalPositions);
			let overlapsSubmitted =  findCommonElements(slot,playedTiles);
			if (containsAtLeastOneLegalSlot && !overlapsSubmitted){
				slotList.push(slot);
			}
		}
	}
	// slotList = slotList.filter(item => (checkLegalitySingleSlot(item)) );
	return slotList;
}

function findAllHorSlotsOfLength(n) {
	let allSlots =[];
	let legalPositions =  getlegalPositions();
	let rows = [];

    for (pos of legalPositions){
		rows.push(pos[0]);
		rows = getUniques(rows);
	}

	for (row of rows){
		let horSlots = findHorSlots(row, n);
		for (horSlot of horSlots){
			if (findCommonElements(legalPositions, horSlot)) { allSlots.push(horSlot);}
		}
	}

	return allSlots;
}

function findAllVerSlotsOfLength(n) {
	let allSlots =[];
	let legalPositions =  getlegalPositions();
	let cols = [];

    for (pos of legalPositions){
		cols.push(parseInt(pos.substr(1)));
		cols = getUniques(cols);
	}

	for (col of cols){
		let vslots = findVerSlots(col, n);
		for (vslot of vslots){
			if (findCommonElements(legalPositions, vslot)) { allSlots.push(vslot);}
		}
	}

	return allSlots;
}

function getAllHorGapSlots(){
	let allSlots =[];
	let legalPositions =  getlegalPositions();
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
	let legalPositions =  getlegalPositions();
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

function hasLetters(slot,which="all"){
	let letterList = getLettersOnSquare(slot);
	if (which==="all"){
		if(findCommonElements(letterList,["TL","DL","TW","DW"])){
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
	if (sArray.length!==slotArray.length){
		console.log("Ooops!!!!!! prioritySort failed")
	}
	return sArray;
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

function getAllRackPermutations(n){////////////////////////Need to check this
	let rackIds=getRackIds();
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

	if (n<6){
		combs = k_combinations(rackIds,n);
		perms = []
		for (comb of combs){
			perms.push(permute(comb));
		}
		perms= perms.flat();
	} else{
		perms = permute(rackIds);
	}
	return removeDuplicates(perms);
}

// function getRackIdsCommonLetters(){
// 	rackIds = getRackIds("rack");
// 	for (let i =0; i<7; i++){
// 		for (let j=0;j<7;j++){
// 			if (i===j){continue;} 
// 			if (readLetter(rackIds[i])=== readLetter(rackIds[j]) && i<j){
// 				rackIds[i] = rackIds[j];
// 			}
			
// 		}
// 	}
// 	return rackIds;
// }


placeClones = function(orig_id, dest_id){
	if (typeof(orig_id)!==typeof(dest_id)){return;}
	
	if ( !(typeof(orig_id)==="string" || Array.isArray(orig_id)))   {return;}
	if (typeof(orig_id) === "string"){
		if ( !isEmptyOnBoard(dest_id) ){return;}
		let origin = document.getElementById(orig_id);
		let tile = getTheTile(origin);
		let cloneTile = tile.cloneNode(true);
		cloneTile.removeAttribute("id");
		let dest = document.getElementById(dest_id);
		dest.appendChild(cloneTile);
		dest.classList.add('played-not-submitted');
		dest.classList.add('clone');
		return;
	}
	if (orig_id.length!== dest_id.length) {return;}

	for (let i=0;i<orig_id.length;i++) {
		placeClones(orig_id[i],dest_id[i]);
	}
	
	
}

removeClones = function(){
	let cloneSpots=document.getElementsByClassName("clone");
	let pns=document.getElementsByClassName("played-not-submitted");
	if (cloneSpots.length===0 && pns.length===0) {return;}
	 
	while (cloneSpots.length>0) {
			cloneTile = cloneSpots[0].children[0];
			cloneSpots[0].removeChild(cloneTile);
			cloneSpots[0].classList.remove("played-not-submitted");
			cloneSpots[0].classList.remove("clone");
		}
	
	let remcloneSpots=document.getElementsByClassName("clone");
	if (remcloneSpots.length !==0){console.log(`${remcloneSpots.length} clone spots not cleared`);}

}

checkLegalitySingleSlot = function(slot, verbose=false){
	let verdict = false;
	for (pos of slot){
		if (![ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k","l","m","n","o"].includes(pos[0])) {
			if (verbose){console.log(`Cannot place tile on bad slot ${pos}` )}
			return verdict; 
		}
		if (![ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", '11', "12","13","14","15" ].includes(pos.substr(1))) {
			if (verbose){console.log(`Cannot place tile on bad slot ${pos}` )}
			return verdict;  
		}
		if (!isEmptyOnBoard(pos)){
			if (verbose){console.log(`Cannot place tile on occupied slot ${pos}` )}
			removeClones();
			return verdict; 
		}
		placeClones("s1", pos);
	}
	let tiles = getTilesPlayedNotSubmitted();
	verdict = checkLegalPlacement(tiles);
	if (!verdict && verbose){console.log(`Bad Slot: ${slot}`) }
	removeClones();
	return verdict;
}

checkLegalityAll = function(slots){
	for (slot of slots){
		if (!checkLegalitySingleSlot(slot)) {
			console.log(`checkLegalityAll found bad Slot: ${slot}`)
			return false;
		}
	}
	return true;
}

