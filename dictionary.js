
let scrabbledict = new Set();

for (word of dict){
  scrabbledict.add(word);
}


function checkDict(txt) {
  return scrabbledict.has(txt);
}

function getWordToCheck() {
    let myform = document.getElementById("submittedWord");
    let inputword = myform[0].value.toUpperCase();
    if (inputword==="") {return;}
    // console.log(`${inputword} was checked and found to be ${checkDict(inputword)}`)
    
    if (checkDict(inputword)){
        let u = document.getElementsByClassName("searchresult")[0];
        u.innerHTML =  `${inputword} is a valid word`;
        u.classList.remove("verdict-bad");
        u.classList.add("verdict-good");
        

    } else {
        let u = document.getElementsByClassName("searchresult")[0];
        u.innerHTML =  `${inputword} is not a valid word`;
        u.classList.remove("verdict-good");
        u.classList.add("verdict-bad");

    }
    myform[0].value="";
}

