importScripts("dictformatted.js", "dictionary.js","workerLibrary.js");

// THIS WORKER DOES 1

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
    if (legalPositions.length!==1){
        postMessage(`Trying single tiles`)
        trySingles(maxTries);
        postMessage(`Done trying single tiles`)
    }

    
   postMessage(rupa);
//    self.close();
  }




     