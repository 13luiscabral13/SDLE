const { response } = require('express');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const zmq = require("zeromq");

if (!isMainThread) {
    let { port, cart } = workerData;

    const context = new zmq.Context();
    let sock = new zmq.Request(context);
    sock.connect("tcp://localhost:8000");
    sock.sendTimeout = 0;

    async function subscribeProxy() {
        parentPort.postMessage({ type: 'loadCart' });

        // Waiting for the response from MainThread
        await new Promise(resolve => setTimeout(resolve, 10));
        try {
            await sock.send(["", port, cart]);
        } catch (err) {
            console.error("Error sending to proxy");
            return; // Log the error and return from the function
        }

        for await (const [delimiter, id, response] of sock) {
            console.log("received a message related to:", id.toString(), "containing message:", response.toString());
            if (id.toString() == port.toString()) {
                cart = response.toString();
                break;
            }
        }

        parentPort.postMessage({ type: 'responseFromServer', cart: cart });
    }

    parentPort.on('message', (message) => {
        if (message.type === 'updateCart') {
            cart = message.cart;
        }
    });

    setInterval(subscribeProxy, 5000);
}
