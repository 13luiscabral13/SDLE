const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.argv[2]; // Use the provided port or default to 5500

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    const filePath = path.join(__dirname, '../src/index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (req.url === '/js/script.js') {
    const filePath = path.join(__dirname, '../src/js/script.js');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading script.js');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.end(data);
      }
    });
  } else if (req.url === '/css/style.css') {
    const filePath = path.join(__dirname, '../src/css/style.css');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading style.css');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
      }
    });
  }
  // You can add more routes as needed.
});

server.listen(port, () => {
  console.log(`Web interface is running on http://localhost:${port}`);
});


// create local database if there isnt one