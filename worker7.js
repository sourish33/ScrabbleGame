//THIS WORKER DOES 7
importScripts("dictformatted.js", "dictionary.js","workerLibrary.js");


NN = 7;
cols = generateCols();
rows = generateRows();
rupa = createAIPlayer();


onmessage = function(e) {
    board = e.data[0];
    legalPositions = e.data[1];
    played_ids = e.data[2];
    submitted_ids = e.data[3];
    boosters = e.data[4];
    maxTries= e.data[5];
    cur_points= e.data[6];
    maxPoints= e.data[7];

    rupa.score=cur_points;


    rackIds=getRackIds();
    if (!rupa.haveIwon){

        tryNletters(NN, maxTries)
        postMessage(`Done with ${NN}-letter combos`)
        }

    postMessage(rupa);
    // self.close();
  }




      

































//OLD CODE

// //THIS WORKER DOES 7
// importScripts("dictformatted.js", "dictionary.js","workerLibrary.js");

// // console.log("Hello I am the grestest worker");

// cols = generateCols();
// rows = generateRows();
// rupa = createAIPlayer();


// onmessage = function(e) {
//     t0=performance.now()
//     board = e.data[0];
//     legalPositions = e.data[1];
//     played_ids = e.data[2];
//     submitted_ids = e.data[3];
//     boosters = e.data[4];
//     maxTries= e.data[5];
//     cur_points= e.data[6];
//     maxPoints= e.data[7];

//     rupa.score=cur_points;



//     rackIds=getRackIds();
//     if (!rupa.haveIwon){

//         tryNletters(7, maxTries)
        
//         postMessage(`Done with ${7}-letter combos`)
//         }




//     postMessage(rupa);
//   }

