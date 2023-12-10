const zmq = require("zeromq")
const cluster = require("cluster")
const startServer = require('./server.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

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
        console.log('Proxy terminated');
        process.exit()
    });

    proxy.run();
    console.log('Proxy running...');
}

// Distribute the workers
if (cluster.isMaster) {
    // juntar ficheiro de configurações
    for (var i = 0; i < config.servers.length; i++) {
        const port = config.servers[i]
        const worker = cluster.fork({
            "PORT": port
        });

        worker.port = port

        // Listen for custom message from the worker
        worker.on('message', (message) => {
            if (message === 'terminate') {
                console.log(`Terminating worker ${worker.process.pid}...`);
                worker.kill();
            }
        });
    }

    cluster.on('death', async function(worker) {
        console.log('worker ' + worker.process.pid + ' with port: ' + worker.port + ' exited');
    });

    cluster.on('exit', async function(worker) {
        console.log('worker ' + worker.process.pid + ' with port: ' + worker.port + ' exited');
        await new Promise(resolve => setTimeout(resolve, 5000));
        cluster.fork({
            "PORT": worker.port
        })
    });

    run()
} else {
    startServer(process.env.PORT);

    if (process.env.PORT === '5000') {
        setTimeout(() => {
            console.log(`Simulating worker termination...`);
            process.send('terminate');
        }, 7000);
    }
}
