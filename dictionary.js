
let scrabbledict = new Set();

for (word of dict){
  scrabbledict.add(word);
}


function checkDict(txt) {
  return scrabbledict.has(txt.toUpperCase());
}

function allValidWords(){
	let words = readAllWords(getAllNewWords());
	for (let word of words){
		if (!checkDict(word)) {return false}
	}
	return true;
}

// function getWordToCheck() {
//     let myform = document.getElementById("submittedWord");
//     // let formInput = document.getElementById("dicInput");
//     // formInput.focus();
//     // formInput.scrollIntoView();
//     let inputword = myform[0].value.toUpperCase();
//     if (inputword==="") {return;}
//     // console.log(`${inputword} was checked and found to be ${checkDict(inputword)}`)
    
//     if (checkDict(inputword)){
//         let u = document.getElementsByClassName("searchresult")[0];
//         u.innerHTML =  `${inputword} is a valid word`;
//         u.classList.remove("verdict-bad");
//         u.classList.add("verdict-good");
        

//     } else {
//         let u = document.getElementsByClassName("searchresult")[0];
//         u.innerHTML =  `${inputword} is not a valid word`;
//         u.classList.remove("verdict-good");
//         u.classList.add("verdict-bad");

//     }
//     myform[0].value="";
// }

function checknow() {
  let myform = document.getElementById("submittedWord");
  let inputword = myform[0].value.toUpperCase();
  if (inputword.length<2) {return}
  
  if (checkDict(inputword)){
    let u = document.getElementsByClassName("searchresult")[0];
    u.innerHTML =  `${inputword} is a valid word`;
    u.classList.remove("verdict-bad");
    u.classList.remove("ghost");
    u.classList.add("verdict-good");
    } else {
        let u = document.getElementsByClassName("searchresult")[0];
        u.innerHTML =  `${inputword} is not a valid word`;
        u.classList.remove("verdict-good");
        u.classList.remove("ghost");
        u.classList.add("verdict-bad");
    }


}

function clearDict() {//clears the search box and result box
  let myform = document.getElementById("submittedWord");
  myform[0].value="";
  clearResult()

}

function clearResult() {//clears the result box
  let u = document.getElementsByClassName("searchresult")[0];
  u.innerHTML="hello"
  u.classList.add("ghost");
}

