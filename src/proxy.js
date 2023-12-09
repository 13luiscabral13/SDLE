const zmq = require("zeromq")

const context = new zmq.Context()

let frontend = null;
async function frontend_run() {
    frontend = new zmq.Router(context)
    await frontend.bind('tcp://*:8000');
    console.log('Binding frontend on port 8000');
}

let backend = null
async function backend_run() {
    backend = new zmq.Router(context)
    await backend.bind('tcp://*:9000');
    console.log('Binding backend on port 9000');
}


async function run() {
    await frontend_run();
    await backend_run();

    // Create a message proxy
    const proxy = new zmq.Proxy(frontend, backend);

    // Cleanup when the process is terminated
    process.on('SIGINT', () => {
      frontend.close();
      backend.close();
      context.term();
      console.log('Proxy terminated');
    });

    proxy.run();
    console.log('Proxy running...');
}

// Start the proxy
run();