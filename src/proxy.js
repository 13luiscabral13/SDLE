const zmq = require("zeromq")

const context = new zmq.Context()

// XSUB socket
let frontend_sub = null;
let frontend_pub = null;
async function frontend_run() {
    frontend_sub = new zmq.XSubscriber(context)
    await frontend_sub.bind('tcp://*:8000');
    console.log('Binding frontend_sub on port 8000');

    frontend_pub = new zmq.XPublisher(context)
    await frontend_pub.bind('tcp://*:8001');
    console.log('Binding frontend_pub on port 8001'); 
}

// XPUB socket
let backend_sub = null;
let backend_pub = null;
async function backend_run() {
    backend_sub = new zmq.XSubscriber(context)
    await backend_sub.bind('tcp://*:9001');
    console.log('Binding backend_sub on port 9001');

    backend_pub = new zmq.XPublisher(context)
    await backend_pub.bind('tcp://*:9000');
    console.log('Binding backend_pub on port 9000');
}


async function run() {
    await frontend_run();
    await backend_run();

    // Create a message proxy
    const proxy_1 = new zmq.Proxy(frontend_sub, backend_pub);
    const proxy_2 = new zmq.Proxy(frontend_pub, backend_sub);

    // Cleanup when the process is terminated
    process.on('SIGINT', () => {
      frontend.close();
      backend.close();
      context.term();
      console.log('Proxy terminated');
    });

    proxy_1.run();
    proxy_2.run();
    console.log('Proxy running...');
}

// Start the proxy
run();