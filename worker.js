importScripts("dictformatted.js", "dictionary.js","workerLibrary.js");

// THIS IS THE ALL PURPOSE WORKER

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
    console.log("This is the worker all-purpose")
    if (legalPositions.length!==1){
        // postMessage(`Trying single tiles`)
        trySingles(maxTries);
        postMessage(`Single letters done`)
    }
    
    if (!rupa.haveIwon){
    for (let i=2;i<8;i++){
        // postMessage(`Trying ${i}-letter combinations`)
        tryNletters(i, maxTries)
        if (rupa.haveIwon){
            break;
            }
        postMessage(`Done with ${i}-letter words`)
        }
        
    }

    // console.log("Worker0 done")
   postMessage(rupa);
//    self.close();
  }




      


    // rupa.score=cur_points+100;
    // rupa.bestMove["from"]=["s1","s2"];
    // rupa.bestMove["to"] = ["a1","a2"];
    // rupa.bestMove["points"] = 63;
    // rupa.haveIwon=true;

    // let t0=performance.now();
    // let p = score();
    // let t1=performance.now();
    // let msg = `calculated ${p} in ${t1-t0} ms`
    // let r = readAllWords(getAllNewWords())
    // placeCloneTiles("s1","a1");
    // placeCloneTiles(["s2","s3","s7"],["a2","a3","o6"]);
    // removeCloneTiles();
    // let h = getAllSlotsSortedByLen()[7];
    // let t0=performance.now();
    // //let h = getAllSlotsSortedByLen()[4];
    // let h = getAllRackPermutations(6);
    // let t1=performance.now();
    // let msg = `calculated ${h.length} in ${t1-t0} ms`


