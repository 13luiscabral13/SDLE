const express = require('express');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const zmq = require("zeromq")
const Cart = require('./crdt/Cart.js');

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

const context = new zmq.Context()
const sock = new zmq.Request(context)
sock.connect("tcp://localhost:9000")

async function client_requests() {
  for await (const [id, msg] of sock) {
    console.log("received a message related to:", id.toString(), "containing message:", msg.toString())
    
    const response = cart.merge(msg, true)
    console.log(cart.info())

    await sock.send([id, response])
  }
}

client_requests()