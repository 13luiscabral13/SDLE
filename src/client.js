const http = require('http');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const port = process.argv[2]; // Use the provided port or default to 5500

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    const filePath = path.join(__dirname, '../src/index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        // Inject the port information into the HTML
        const htmlContent = data.toString().replace('{{PORT}}', port);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlContent);
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
});

server.listen(port, () => {
  console.log(`Web interface is running on http://localhost:${port}`);
});

// create local database if there isnt one
const databaseDir = '../database/local';
if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir);
}

const dbFile = `../database/local/${port}.db`;
if (!fs.existsSync(dbFile)) {
  console.log(`Database file doesn't exist. Creating a new database at ${dbFile}`);
  var db = new sqlite3.Database(dbFile);

  // Read the schema.sql file
  const schemaPath = '../database/schema.sql'
  const schema = fs.readFileSync(schemaPath, 'utf8');

  // Execute the schema.sql SQL statements
  db.exec(schema, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Schema has been executed successfully');
    }
  });

  // initial populate of the schema
  const dataPath = '../database/data.sql'
  const data = fs.readFileSync(dataPath, 'utf8');

  // Execute the data.sql SQL statements
  db.exec(data, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Data has been inserted successfully');
    }
  });
}
else {
  var db = new sqlite3.Database(dbFile);
}

db.all('SELECT * FROM list', (err, rows) => {
  if (err) {
    console.error(err.message);
    return;
  }

  // Handle the fetched data here (e.g., logging or processing)
  console.log(rows);
});


