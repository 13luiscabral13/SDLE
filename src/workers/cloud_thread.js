const { response } = require('express');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const zmq = require("zeromq")

if (!isMainThread) {
    let { port , cart } = workerData;

    const subscriber = new zmq.Subscriber
    subscriber.connect("tcp://localhost:8001")
    subscriber.subscribe(port)

    const publisher = new zmq.Publisher
    publisher.connect("tcp://localhost:8000")

    async function subscribeProxy() {
        parentPort.postMessage({ type: 'loadCart' });

        // waiting for the response from MainThread
        await new Promise(resolve => { setTimeout(resolve, 10) })
        
        await publisher.send([port, cart])
        for await (const [id, response] of subscriber) {
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
    
    setInterval(subscribeProxy, 5000);
    //subscribeProxy()
}