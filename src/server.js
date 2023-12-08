const express = require('express');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const httpPort = 5000;
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
