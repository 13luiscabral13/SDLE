const express = require('express');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const zmq = require("zeromq")
const Cart = require('./crdt/Cart.js');
const { Worker } = require('worker_threads');

const port = process.argv[2];
  
if (!port) {
  console.log('Please provide a <PORT> on the command \x1b[3mnode client.js <PORT>\x1b[0m. (Example: node client.js 5500)');
  process.exit(1); // Exit the script
}

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

const subscriber = new zmq.Subscriber
subscriber.connect("tcp://localhost:9000")
subscriber.subscribe("5500")
subscriber.subscribe("5501")
subscriber.subscribe("5001")
subscriber.subscribe("5002")

const publisher = new zmq.Publisher
publisher.connect("tcp://localhost:9001")

async function client_requests() {
  for await (const [id, msg] of subscriber) {
    console.log("received a message related to:", id.toString(), "containing message:", msg.toString())
    
    const response = cart.merge(msg, true)
    console.log(cart.info())

    await publisher.send([id, response])
  }
}

client_requests()

// Worker thread responsável por enviar updates aos vizinhos e receber updates vindos dos outros servers
const updateWorker = new Worker('./workers/servers_thread.js', { workerData: { port } });

updateWorker.on('message', (message) => {
  if(message.type === 'updateCart') {
    cart.merge(message.cart);
  }
})

//De 5 em 5 segundos, server manda updates para os seus vizinhos
async function sendingUpdates() {
  updateWorker.postMessage({ type: 'updateNeighbors', cart: cart});
}

setInterval(sendingUpdates, 7000);
