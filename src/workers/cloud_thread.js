const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const zmq = require("zeromq")

if (!isMainThread) {
    let { port , cart } = workerData;

    const socket = new zmq.Subscriber
    socket.connect("tcp://localhost:5564")

    function subscribeProxy() {
        parentPort.postMessage({ type: 'loadCart' });

        // socket.subscribe(port)
        // cart.merge

        parentPort.postMessage({ type: 'responseFromServer', cart: cart})
    }

    parentPort.on('message', (message) => {
        if (message.type === 'updateCart') {
            cart = message.cart;
        }
    });
    
    setInterval(subscribeProxy, 2000);
}