const Cart = require('./crdt/Cart.js');
const { Worker, isMainThread } = require('worker_threads');
const zmq = require("zeromq");
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

async function startServer(port) {
    // Creation and loading of the database
    const dbFile = `../database/servers/${port}.db`;
    let db = null
    if (!fs.existsSync(dbFile)) { // create local database if there isnt one
        db = new sqlite3.Database(dbFile);

        // Read the schema.sql file
        const schemaPath = '../database/schema.sql';
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Execute the schema.sql SQL statements
        db.exec(schema, (err) => {
            if (err) {
            console.error(err.message);
            } else {
            console.log('Schema has been executed successfully');
            }
        });
    } else { // If db already exists
        db = new sqlite3.Database(dbFile);
    }

    let cart = new Cart(port);
    cart.load(db)

    // Worker thread responsável por enviar updates aos vizinhos e receber updates vindos dos outros servers
    const updateWorker = new Worker('./workers/servers_thread.js', { workerData: { httpPort: port } });

    updateWorker.on('message', (message) => {
        if(message.type === 'updateCart') {
            cart.merge(message.cart);
        }
    })

    //De 5 em 5 segundos, server manda updates para os seus vizinhos
    async function sendingUpdates() {
        updateWorker.postMessage({ type: 'updateNeighbors', cart: cart.toString()});
    }

    setInterval(sendingUpdates, 5000);

    const context = new zmq.Context()
    const sock = new zmq.Reply(context)
    sock.connect("tcp://localhost:9000")
    console.log("worker ready...");

    for await (const [delimiter, id, response] of sock) {
        console.log(port + " received a message related to:", id.toString(), "containing message:", response.toString())
        
        const reply = cart.merge(response, true)
        console.log(cart.info())
    
        await sock.send(["", id, reply])
    }
}

module.exports = startServer;
