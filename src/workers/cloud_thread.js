const { response } = require('express');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const zmq = require("zeromq")

if (!isMainThread) {
    let { port , cart } = workerData;

    const context = new zmq.Context()
    const sock = new zmq.Request(context)
    sock.connect("tcp://localhost:8000")

    async function subscribeProxy() {
        parentPort.postMessage({ type: 'loadCart' });

        // waiting for the response from MainThread
        await new Promise(resolve => { setTimeout(resolve, 10) })
        
        await sock.send([port, cart])
        for await (const [id, response] of sock) {
            console.log("received a message related to:", id.toString(), "containing message:", response.toString())
            if(id.toString() == port.toString()) {
                cart = response.toString()
                break;
            }
        }

        parentPort.postMessage({ type: 'responseFromServer', cart: cart})
    }

    parentPort.on('message', (message) => {
        if (message.type === 'updateCart') {
            cart = message.cart;
        }
    });
    
    //setInterval(subscribeProxy, 5000);
    subscribeProxy()
}