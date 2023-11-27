const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const zmq = require("zeromq")

if (!isMainThread) {
    let { port , crdt } = workerData;

    const socket = new zmq.Subscriber
    socket.connect("tcp://localhost:5564")

    function subscribeProxy() {
        parentPort.postMessage({ type: 'needUpdateCrdt' });

        // socket.subscribe(port)
        // crdt.merge

        parentPort.postMessage({ type: 'responseFromServer', crdt: crdt})
    }

    parentPort.on('message', (message) => {
        if (message.type === 'updateCrdt') {
            crdt = message.crdt;
            //console.log("CRDT updated")
        }
    });
    
    setInterval(subscribeProxy, 2000);
}