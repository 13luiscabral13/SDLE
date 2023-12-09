const zmq = require("zeromq")
const cluster = require("cluster")
const startServer = require('./server.js');
const workers = 3

const context = new zmq.Context()

async function run() {
    const frontend = new zmq.Router(context);
    const backend = new zmq.Dealer(context);

    await frontend.bind('tcp://*:8000');
    console.log('Binding frontend on port 8000');

    await backend.bind('tcp://*:9000');
    console.log('Binding backend on port 9000');

    const proxy = new zmq.Proxy(frontend, backend)

    // Cleanup when the process is terminated
    process.on('SIGINT', () => {
        frontend.close();
        backend.close();
        proxy.terminate();
        context.term();
        console.log('Proxy terminated');
    });

    proxy.run();
    console.log('Proxy running...');
}

// Distribute the workers
if (cluster.isMaster) {
    const port = 5000
    for (var i = 0; i < workers; i++) cluster.fork({
        "PORT": port+i
      });

    run()
} else {
    startServer(process.env.PORT)
}