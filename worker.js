importScripts("dictformatted.js", "dictionary.js","workerLibrary.js");

// console.log("Hello I am the grestest worker");
rackIds=[ "s1", "s2", "s3", "s4", "s5", "s6", "s7" ];
cols = generateCols();
rows = generateRows();
rupa = createAIPlayer();


onmessage = function(e) {
    t0=performance.now()
    board = e.data[0];
    legalPositions = e.data[1];
    played_ids = e.data[2];
    submitted_ids = e.data[3];
    boosters = e.data[4];
    maxTries= e.data[5];
    cur_points= e.data[6];
    maxPoints= e.data[7];

    rupa.score=cur_points;

    if (legalPositions.length!==1){
        postMessage(`Trying single tiles`)
        trySingles(maxTries);
    }
    // t0=performance.now()
    if (!rupa.haveIwon){
    for (let i=2;i<8;i++){
        postMessage(`Trying ${i}-letter combinations`)
        // if (i<6) {
        //     tryNletters(i, maxTries)
        // } else {
        //     tryNletters(i, 1000)
        // }
        tryNletters(i, maxTries)
        if (rupa.haveIwon){
            break;
            }

        }
    }



    // tryNletters(2, maxTries)
    // postMessage("2 letter words complete")
    // tryNletters(3, maxTries)
    // postMessage("3 letter words complete")
    // tryNletters(4, maxTries)
    // postMessage("4 letter words complete")
    // tryNletters(5, maxTries)
    // postMessage("5 letter words complete")
    // tryNletters(6, maxTries)
    // postMessage("6 letter words complete")
    // tryNletters(7, maxTries)
    // postMessage("7 letter words complete")

    // t1=performance.now()
    // postMessage(`Best Move Found: ${readWord(rupa.bestMove["from"])} to ${rupa.bestMove["to"][0]} gets ${rupa.bestMove["points"]} points in ${t1-t0} ms`);

    postMessage(rupa);
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


