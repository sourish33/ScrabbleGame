function show(x){
    x.classList.remove("not-there")
}

function hide(x){
    x.classList.add("not-there")
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

let players=[]
AINameList=["AI Parker", "AI Tori", "AI Lily", "AI Sienna", "AI Jasmine", "AI Dylan", "AI Kira", "AI Kashmir"]
AINames =shuffle(AINameList)
let AIList=[]

function randomUpTo(max) { // min and max included 
    let min=0;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }


function addPlayerH(){
    let f1= document.getElementById("1stplayer");
    let f2 = document.getElementById("2ndplayer");
    let f3 = document.getElementById("3rdplayer");
    let f4 = document.getElementById("4thplayer");
    let ai1 = document.getElementById("AIlevel1");
    let ai2 = document.getElementById("AIlevel2");
    let ai3 = document.getElementById("AIlevel3");
    let ai4 = document.getElementById("AIlevel4");
    let fs=[f1,f2,f3,f4]
    let ais =[ai1, ai2, ai3, ai4]
    let button1 = document.getElementById("addH");
    let button2 = document.getElementById("addC");
    let button3 = document.getElementById("removeplayerbutton");

    if (players.length===0){
        show(fs[0])
        hide(ais[0])
        players.push(fs[0])
        AIList.push(0)
        show(button3)
        return 
    }

    let v=players.length;
    show(fs[v])
    hide(ais[v])
    players.push(fs[v])
    AIList.push(0)

    
    if (players.length===4){
        hide(button1)
        hide(button2)
        return
    }


}

function addPlayerC(){
    let f1= document.getElementById("1stplayer");
    let f2 = document.getElementById("2ndplayer");
    let f3 = document.getElementById("3rdplayer");
    let f4 = document.getElementById("4thplayer");
    let ai1 = document.getElementById("AIlevel1");
    let ai2 = document.getElementById("AIlevel2");
    let ai3 = document.getElementById("AIlevel3");
    let ai4 = document.getElementById("AIlevel4");
    let fs=[f1,f2,f3,f4]
    let ais =[ai1, ai2, ai3, ai4]
    let button1 = document.getElementById("addH");
    let button2 = document.getElementById("addC");
    let button3 = document.getElementById("removeplayerbutton");

    if (players.length===0){
        show(fs[0])
        show(ais[0])
        players.push(fs[0])
        document.getElementById(`player${1}`).value = AINames.pop()
        document.getElementById(`player${1}`).disabled = true
        AIList.push(1)
        show(button3)
        return 
    }


    
    let v=players.length;
    show(fs[v])
    show(ais[v])
    players.push(fs[v])
    document.getElementById(`player${v+1}`).value = AINames.pop()
    document.getElementById(`player${v+1}`).disabled = true
    AIList.push(1)
    if (players.length===4){
        hide(button1)
        hide(button2)
        return
    }
    

}

function removePlayer(){
    
    let f1= document.getElementById("1stplayer");
    let f2 = document.getElementById("2ndplayer");
    let f3 = document.getElementById("3rdplayer");
    let f4 = document.getElementById("4thplayer");
    let ai1 = document.getElementById("AIlevel1");
    let ai2 = document.getElementById("AIlevel2");
    let ai3 = document.getElementById("AIlevel3");
    let ai4 = document.getElementById("AIlevel4");
    let fs=[f1,f2,f3,f4]
    let ais =[ai1, ai2, ai3, ai4]
    let button1 = document.getElementById("addH");
    let button2 = document.getElementById("addC");
    let button3 = document.getElementById("removeplayerbutton");

    if (players.length===0){return}
    if (players.length===1){ 
        hide(button3)

    }
    let n = players.length;
    let u = players.pop();
    AIList.pop();
    hide(u)
    resetPlayer(n)
    AINames =shuffle(AINameList)
    show(button1)
    show(button2)

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
    document.getElementById(`player${i}`).disabled = false;
}

function resetPage(){
   
    for (let i=1;i<5;i++){
        resetPlayer(i);
    }
}

function showInfo(){
    if (document.getElementById("info").innerHTML==="Help"){
        document.getElementById("info").innerHTML = "Hide"
        let infobox = document.getElementById("infocol")
        infobox.classList.remove("not-there")
        infobox.scrollIntoView();

    } else{
        document.getElementById("info").innerHTML = "Help"
        document.getElementById("infocol").classList.add("not-there")
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
        swal("At least two players are required.")
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
    for (let i=1;i<5;i++){
        if (AIList[i-1]===1){
            AIList[i-1]=document.getElementById(`p${i}`).value
        } else{
            AIList[i-1]="0" 
        }
    }

    
    sessionStorage.setItem('AIList', JSON.stringify(AIList))
    sessionStorage.setItem("randomize", getRadioValue("randPlayers"));
    sessionStorage.setItem("dictionary", getRadioValue("dictCheck"));
    sessionStorage.setItem("gameend", getRadioValue("gameType"));

    resetPage();

    window.open('game.html', '_self')
    // window.open('game.html')
}

function showModalInfo(){
    let modal = document.getElementById("myModal");
    modal.style.display="block"
}

function closeMondalInfo(){
    let modal = document.getElementById("myModal");
    modal.style.display="none"
}

// This can start the game upon pressing enter, but might not be a good idea
// document.addEventListener('keypress',function(event){
//     if(event.keyCode == 13) {
//         event.preventDefault();
//         getInitialData()
//     }
// });


sessionStorage.clear();
document.getElementById("playbutton").addEventListener("click", getInitialData);
document.getElementById("addH").addEventListener("click", addPlayerH);
document.getElementById("addC").addEventListener("click", addPlayerC);
document.getElementById("removeplayerbutton").addEventListener('click', removePlayer);
// document.getElementById("info").addEventListener("click",showInfo);
document.getElementById("info").addEventListener("click", showModalInfo);
document.getElementById("closemodal").addEventListener("click", closeMondalInfo);
document.getElementById("dismiss-help").addEventListener("click", closeMondalInfo);
resetPage()

