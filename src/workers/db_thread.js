const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (!isMainThread) {
  let { crdt } = workerData;

  // Define the function to handle database updates
  function updateDB() {
    parentPort.postMessage({ type: 'needUpdateCrdt' });
    
    // update db with crdt

    parentPort.postMessage({ type: 'dbUpdateComplete' });
  }

  parentPort.on('message', (message) => {
    if (message.type === 'updateCrdt') {
        crdt = message.crdt;
        //console.log("CRDT updated")
    }
  });

  // Periodically update the database every 2 seconds
  setInterval(updateDB, 2000);
}