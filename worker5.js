//THIS WORKER DOES 5
importScripts("dictformatted.js", "dictionary.js","workerLibrary.js");


NN = 5;
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




      
