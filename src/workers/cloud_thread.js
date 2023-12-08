const { response } = require('express');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const zmq = require("zeromq")

if (!isMainThread) {
    let { port , cart } = workerData;

    const subscriber = new zmq.Subscriber
    subscriber.connect("tcp://localhost:8001")

    const publisher = new zmq.Publisher
    publisher.connect("tcp://localhost:8000")

    async function subscribeProxy() {
        parentPort.postMessage({ type: 'loadCart' });

        // waiting for the response from MainThread
        await new Promise(resolve => { setTimeout(resolve, 10) })
        
        await publisher.send([port, cart])
        console.log("cart sent")
        for await (const [id, response] of subscriber) {
            console.log("received a message related to:", id, "containing message:", cart)
            if(id == port) {
                cart = response
                break;
            }
        }

        parentPort.postMessage({ type: 'responseFromServer', cart: cart})
    }

    parentPort.on('message', (message) => {
        if (message.type === 'updateCart') {
            console.log("cart loaded")
            cart = message.cart;
        }
    });
    
    //setInterval(subscribeProxy, 5000);
    subscribeProxy()
}