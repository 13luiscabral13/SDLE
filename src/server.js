const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const http = require('http');
const WebSocket = require('ws');

const httpPort = 5000;
const app = express(); // Create an Express application instance.
app.use(express.json()); // to remove when json file is removed

const allowedOrigins = []

app.use(function(req, res, next) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

let shoppingLists = JSON.parse(fs.readFileSync('shoppingLists.json', 'utf8'));

// POST Methods
// Method to create a Shopping List
app.post('/shoppingList', (req, res, next) => { 
  const title = req.body.title
  const timestamp = new Date().toUTCString();
  // Generate a URL based on the title and timestamp
  const url = generateHash(title, timestamp);
  
  shoppingLists.push({id: shoppingLists.length, title: title, url: url, timestamp: timestamp})
  fs.writeFileSync('shoppingLists.json', JSON.stringify(shoppingLists));
  
  console.log(shoppingLists)
  res.status(200).end()
})

function generateHash(title, timestamp) {
  const hash = crypto.createHash('md5');
  hash.update(title + timestamp.toString());
  return hash.digest('hex');
}

// Method to remove a Shopping List
app.post('/delete', (req, res, next) => {
  const title = req.body.title
  const indexToRemove = shoppingLists.findIndex(item => item.title === title);
  
  if (indexToRemove !== -1) {
    // If the object is found, remove it from the array
    shoppingLists.splice(indexToRemove, 1);

    fs.writeFileSync('shoppingLists.json', JSON.stringify(shoppingLists));
    res.status(200).end()
    console.log("deleted succefully")
  }
  else {
    // If the object is not found, send an error response
    res.status(404).end(); // You can use a different status code if needed
    console.log("not deleted")
  }
})

// GET Methods
app.get('/list', (req, res, next) => {
  // list of urls for the display
  res.json(shoppingLists)
}) 

// deals with errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

const server = http.createServer(app); // Pass the app to create the HTTP server.
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
  const origin = req.headers.origin;
  if (!allowedOrigins.includes(origin)) {
    allowedOrigins.push(origin);
    console.log(allowedOrigins)
  }

  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
    console.log(data)
  });
});

server.listen(httpPort, function() {
  console.log(`Server is listening on ${httpPort}!`);
});

// Database
/*
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydatabase.db');

db.all('SELECT * FROM users', [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach(row => {
    console.log(row.id, row.name);
  });
});

db.run('INSERT INTO users (id, name) VALUES (?, ?)', [1, 'John Doe'], function(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`A row has been inserted with id ${this.lastID}`);
});
*/