const express = require('express');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const zmq = require("zeromq")
const Cart = require('./crdt/Cart.js');

const port = 5000

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

const publisher = new zmq.Publisher
publisher.connect("tcp://localhost:9001")

async function client_requests() {
  for await (const [id, msg] of subscriber) {
    console.log("received a message related to:", id, "containing message:", msg)

    cart.merge(msg)

    await publisher.send([id, cart])
  }
}

client_requests()