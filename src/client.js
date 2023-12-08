const Cart = require('./crdt/Cart.js');
const { Worker, isMainThread } = require('worker_threads');

if (isMainThread) {
  const express = require('express');
  const fs = require('fs');
  const path = require('path');
  const sqlite3 = require('sqlite3').verbose();
  const crypto = require('crypto');
  const zmq = require("zeromq");
  
  const app = express();
  app.use(express.json());
  
  // Check if a port is provided as a command-line argument
  const port = process.argv[2];
  
  if (!port) {
    console.log('Please provide a <PORT> on the command \x1b[3mnode client.js <PORT>\x1b[0m. (Example: node client.js 5500)');
    process.exit(1); // Exit the script
  }
  
  // Creates the 'Live Server' where User is running
  app.get('/', (req, res) => { // Gets the index.html content and gives the port of the Client
    const filePath = path.join(__dirname, '../src/index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Error loading index.html');
      } else {
        // Replace {{PORT}} with the actual port
        const htmlContent = data.toString().replace('{{PORT}}', port);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlContent);
      }
    });
  });
  
  // Gets the rest of the files of "src" folder
  app.use(express.static(path.join(__dirname, '../src')));
  
  // Creation and loading of the database
  const dbFile = `../database/local/${port}.db`;
  if (!fs.existsSync(dbFile)) { // create local database if there isnt one
    var db = new sqlite3.Database(dbFile);
  
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
    
    // Initial populate of the schema
    const dataPath = '../database/data.sql';
    const data = fs.readFileSync(dataPath, 'utf8');
    
    // Execute the data.sql SQL statements
    db.exec(data, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Data has been inserted successfully');
      }
    });
  } else { // If db already exists
    var db = new sqlite3.Database(dbFile);
  }

  let cart = new Cart(port);
  cart.load(db)
  
  // GET requests
  app.get('/lists', (req, res) => { // reads all the Users shopping lists
    //const knownLists = crdt.getKnownLists();
    //console.log(knownLists)
    db.all('SELECT * FROM list', (err, rows) => {
      if (err) {
        console.error(err.message);
        return;
      }
    
      console.log(rows);
      res.status(200).json(rows);
    });
  });

  // get a list
  app.get('/lists/:url', (req, res) => {
    const url = req.params.url;
    db.all('SELECT * FROM item WHERE list_url = ?', [url], (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'An error occurred while fetching data.' });
      }

      console.log(rows);
      res.status(200).json(rows);
    });
  });

  // POST Requests
  app.post('/createList', (req, res) => { // create a new shopping list
    const name = req.body.name;
    
    cart.createList(name)
  });

  app.post('/deleteList', (req, res) => { // delete the list with that url
    const url = req.body.url;
    
    const response = cart.deleteList(url)

    console.log(response)
    res.status(200).json(response);
  });

  app.listen(port, () => {
    console.log(`Web interface is running on http://localhost:${port}`);
  });

  const dbUpdateThread = new Worker('./workers/db_thread.js', {workerData: {port: port}});

  setInterval(check_cart_isChanged, 5000)

  function check_cart_isChanged() {
    if(cart.changed()) {
      dbUpdateThread.postMessage({ type: 'updateDB', cart: cart.info() });
    }
  }

  const cloudThread = new Worker('./workers/cloud_thread.js', { workerData: { port: port, cart: cart } });

  // Handle messages from the database update thread
  cloudThread.on('message', (message) => {
    if(message.type === 'loadCart'){
      cloudThread.postMessage({ type: 'updateCart', cart: cart });
    } else if(message.type === 'responseFromServer') {
      //cart.merge(message.cart.toString())
    } else {
      // Handle other types of messages from the database update thread
      console.log('Message from cloud thread:', message);
    }
  });

}
