const express = require('express');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
const zmq = require('zeromq');
const { Worker } = require('worker_threads');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const httpPort = process.argv[2] || 5000;
const increment = process.argv[3] || 1; //Só para teste
let cart = increment;

const app = express(); // Create an Express application instance.
app.use(express.json()); // to remove when json file is removed

const allowedOrigins = []

app.use(function(req, res, next) { // Launch the allowed Origins as an empty list (for now) with the correct accesses
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// deals with errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

const server = http.createServer(app); // Pass the app to create the HTTP server.

/*
- change websocket to proxy connection
- crdt in server ?
- server db ?
*/

const wss = new WebSocket.Server({ server }); 

wss.on('connection', function connection(ws, req) { // Creates a WebSocket with a client so they can communicate
  const origin = req.headers.origin;
  if (!allowedOrigins.includes(origin)) {
    allowedOrigins.push(origin);  // pushes a new allowed Origin - localhost:port (port of the client)
    console.log(allowedOrigins)
  }

  ws.on('message', function incoming(data) { // to be changed, deals with messages of the client
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

// Worker thread responsável por enviar updates aos vizinhos e receber updates vindos dos outros servers
const updateWorker = new Worker('./workers/servers_thread.js', { workerData: { httpPort } });

updateWorker.on('message', (message) => {
  if(message.type === 'updateCart') {
    mergeCart(message.cart);
  }
})

function mergeCart(receivedCart) {
  cart = cart + parseInt(receivedCart, 10) + increment;
  console.log(`Current value: ${cart}\n`);
}

//De 5 em 5 segundos, server manda updates para os seus vizinhos
async function sendingUpdates() {
  while(true) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    updateWorker.postMessage({ type: 'updateNeighbors', cart: cart});
  }
}

sendingUpdates();