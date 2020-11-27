

  1
  2
  3
  4
  5
  6
  7
  8
  9
 10
 11
 12
 13
 14
 15
 16
 17
 18
 19
 20
 21
 22
 23
 24
 25
 26
 27
 28
 29
 30
 31
 32
 33
 34
 35
 36
 37
 38
 39
 40
 41
 42
 43
 44
 45
 46
 47
 48
 49
 50
 51
 52
 53
 54
 55
 56
 57
 58
 59
 60
 61
 62
 63
 64
 65
 66
 67
 68
 69
 70
 71
 72
 73
 74
 75
 76
 77
 78
 79
 80
 81
 82
 83
 84
 85
 86
 87
 88
 89
 90
 91
 92
 93
 94
 95
 96
 97
 98
 99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158
159
160
161
162
163
164
165
166
167
168
169
170
171
172
173
174
175
176
177
178
179
180
181
182
183
184
185
186
187
188
189
190
191
192
193
194
195
196
197
198
199
200
201
202
203
204
205
206
207
208
209
210
211
212
213
214
215
216
217
218
219
220
221
222
223
224
225
226
227
228
229
230
231
232
233
234
235
236
237
238
239
240
241
242
243
244
245
246
247
248
249
250
251
252
253
254
255
256
257
258
259
260
261
262
263
264
265
266
267
268
269
270
271
272
273
274
275
276
277
278

	

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
AINameList=["AI Parker", "AI Tori", "AI Lilly", "AI Sienna", "AI Jasmine", "AI Dylan", "AI Kira", "AI Kashmir"]
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
        // alert("At least two players are required.")
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



document.getElementById("playbutton").addEventListener("click", getInitialData);
document.getElementById("addH").addEventListener("click", addPlayerH);
document.getElementById("addC").addEventListener("click", addPlayerC);
document.getElementById("removeplayerbutton").addEventListener('click', removePlayer);
// document.getElementById("info").addEventListener("click",showInfo);
document.getElementById("info").addEventListener("click", showModalInfo);
document.getElementById("closemodal").addEventListener("click", closeMondalInfo);
document.getElementById("dismiss-help").addEventListener("click", closeMondalInfo);
resetPage()

