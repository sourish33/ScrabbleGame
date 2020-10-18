// let moveNumber =1;
// let player1Name = "Ram"
// let player2Name ="Ravan"
// let numPlayers = 2;
// let dictionaryChecking = true;

function show(x){
    x.classList.remove("not-there")
}

function hide(x){
    x.classList.add("not-there")
}

let players=[]


function addPlayer(){
    let f1= document.getElementById("1stplayer");
    let f2 = document.getElementById("2ndplayer");
    let f3 = document.getElementById("3rdplayer");
    let f4 = document.getElementById("4thplayer");
    let fs=[f1,f2,f3,f4]
    let button1 = document.getElementById("addH");
    let button2 = document.getElementById("addC");
    let button3 = document.getElementById("removeplayerbutton");
    // let f1invisible=f1.classList.contains("not-there");
    // let f2invisible = f2.classList.contains("not-there");
    // let f3invisible=f3.classList.contains("not-there");
    // let f4invisible = f4.classList.contains("not-there");
    // let f1visible = !f1invisible;
    // let f2visible = !f2invisible;
    // let f3visible = !f3invisible;
    // let f4visible = !f4invisible;

    if (players.length===0){
        show(fs[0])
        players[0]=fs[0]
        show(button3)
        return 
    }

    if (Object.keys(players).length===4){
        hide(button1)
        hide(button2)
        return
    }
    else {
        let v=players.length;
        show(fs[v])
        players.push(fs[v])
    }

}

function removePlayer(){////WORKING ON THIS!!!
    /////TODO: Reset a player when removing them
    f3 = document.getElementById("3rdplayer");
    f4 = document.getElementById("4thplayer");
    button1 = document.getElementById("addH");
    button2 = document.getElementById("removeplayerbutton");
    f3invisible=f3.classList.contains("not-there");
    f4invisible = f4.classList.contains("not-there");
    f3visible = !f3invisible;
    f4visible = !f4invisible;

    if (f3visible && f4invisible){
        hide(f3)
        resetPlayer(3)
        hide(button2)
        // button2.removeEventListener('click')
    }

    if (f3visible && f4visible){
        hide(f4)
        resetPlayer(4)
        show(button1)
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

function showAILevel(n){

    let level = document.getElementById(`AIlevel${n}`)
    if (check.checked){
        level.classList.remove("ghost")
    } else {
        level.classList.add("ghost")
    }
}

function resetPlayer(i){
    document.getElementById(`player${i}`).value ="";
    document.getElementById(`p${i}`).value="1";
}

function resetPage(){
   
    for (let i=1;i<5;i++){
        resetPlayer(i);
    }
}



function getInitialData() {
    sessionStorage.clear();
    let p1= document.getElementById("player1").value;
    let p2= document.getElementById("player2").value;
    let p3= document.getElementById("player3").value;
    let p4= document.getElementById("player4").value;
    let thePlayers = [p1,p2,p3,p4]
    let nonzeros = thePlayers.filter(function(e){ return e === 0 || e });
    if (nonzeros.length <2){
        alert("At least two player names are required.")
        return;
    }
    
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
    //creating AI List
    // let AIList = []
    // for (let i=1;i<5;i++){
       
    //     if (document.querySelector(`input[name=ck${i}]`).checked==true){
    //         AIList.push(document.getElementById(`p${i}`).value)
    //     } else{
    //         AIList.push("0")
    //     }
    // }

    
    sessionStorage.setItem('AIList', JSON.stringify(AIList))
    sessionStorage.setItem("randomize", getRadioValue("randPlayers"));
    sessionStorage.setItem("dictionary", getRadioValue("dictCheck"));
    sessionStorage.setItem("gameend", getRadioValue("gameType"));

    resetPage();

    window.open('game.html', '_self')
    // window.open('game.html')
}


// document.getElementById("playbutton").addEventListener("click", function (){
//     window.open('index.html', '_self');
// });

document.getElementById("playbutton").addEventListener("click", getInitialData);
document.getElementById("addH").addEventListener("click", addPlayer);
document.getElementById("removeplayerbutton").addEventListener('click', removePlayer);
resetPage()

