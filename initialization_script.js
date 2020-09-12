// let moveNumber =1;
// let player1Name = "Ram"
// let player2Name ="Ravan"
// let numPlayers = 2;
// let dictionaryChecking = true;


function addPlayer(){
    f3 = document.getElementById("3rdplayer");
    f4 = document.getElementById("4thplayer");
    butt = document.getElementById("addplayerbutton");
    f3invisible=f3.classList.contains("not-there");
    f4invisible = f4.classList.contains("not-there");
    if (f3invisible && f4invisible){
        f3.classList.remove("not-there");
    }
    if (!f3invisible && f4invisible){
        f4.classList.remove("not-there");
        butt.classList.add("not-there");
    }
}

function getRadioValue(name){
        let ele = document.getElementsByName(name); 

        let selected ="";
        for(let i = 0; i < ele.length; i++) { 
            if(ele[i].checked) {
                selected= ele[i].value;}
 
        } 
    
        return selected;
}



function getInitialData() {
    sessionStorage.clear();
    let p1= document.getElementById("player1").value;
    let p2= document.getElementById("player2").value;
    let p3= document.getElementById("player3").value;
    let p4= document.getElementById("player4").value;
    let thePlayers = [p1,p2,p3,p4]
    let nonzeros = thePlayers.filter(function(e){ return e === 0 || e });
    if (nonzeros.length <2){return;}
    
    let playernum =1;
    for (player of thePlayers){
        
        let pvar = `player${playernum}Name`;

        if (player!==""){
            sessionStorage.setItem(pvar, player);
            // console.log(`Just stored ${sessionStorage.getItem(pvar)}`);
        } else {
            sessionStorage.setItem(pvar, "_");
            // console.log(`Just stored ${sessionStorage.getItem(pvar)}`);
        }
        playernum++;

    }

    //Radio Buttons
    // let randPlayers = getRadioValue("randPlayers");
    // let dictCheck = getRadioValue("dictCheck");
    // let gameType = getRadioValue("gameType");

    sessionStorage.setItem("randomize", getRadioValue("randPlayers"));
    sessionStorage.setItem("dictionary", getRadioValue("dictCheck"));
    sessionStorage.setItem("gameend", getRadioValue("gameType"));



    document.getElementById("player1").value ="";
    document.getElementById("player2").value ="";
    document.getElementById("player3").value ="";
    document.getElementById("player4").value ="";


    // window.open('index.html', '_self')
    window.open('index.html')
}


// document.getElementById("playbutton").addEventListener("click", function (){
//     window.open('index.html', '_self');
// });

document.getElementById("playbutton").addEventListener("click", getInitialData);
document.getElementById("addplayerbutton").addEventListener("click", addPlayer);

