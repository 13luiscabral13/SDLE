const express = require('express');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const Cart = require('./crdt/Cart.js');

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


// GET requests
app.get('/lists', (req, res) => { // reads all the Users shopping lists
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
  const fullUrl = req.params.url;
  const url = fullUrl.replace(/^\/lists\//, '');
  // Fetch list name based on the provided URL
  db.get('SELECT name FROM list WHERE url = ?', [url], (err, list) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'An error occurred while fetching data.' });
    }

    if (!list) {
      return res.status(404).json({ error: 'List not found.' });
    }

    // Fetch rows based on the list URL
    db.all('SELECT * FROM item WHERE list_url = ?', [url], (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'An error occurred while fetching data.' });
      }

      console.log("Fetched url: ", url);
      console.log(rows);

      // Create a response object with list name and rows
      const response = {
        listName: list.name,
        items: rows
      };

      res.status(200).json(response);
    });
  });

});


// POST Requests
app.post('/createList', (req, res) => { // create a new shopping list
  const name = req.body.name;
  const url = generateHash(name);

  // insert a new list in local db
  db.run('INSERT INTO list (name, url) VALUES (?, ?)', [name, url], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error Creating a List!'});
    } else {
      res.status(200).json({ message: 'List created!'});
    }
  });
});

app.post('/deleteList', (req, res) => { // delete the list with that url
  const url = req.body.url;
  
  db.run('DELETE FROM list WHERE url = ?', [url], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error Deleting the List!'});
    } else {
      res.status(200).json({ message: `List with URL ${url} has been deleted!`});
    }
  });
});

app.post('/changeItems', (req, res) => {
  const items = req.body.changes;
  console.log("Received: ", items);
  console.log("Items: ", items);
  res.status(200).json({message: `Items Received`});
});

app.listen(port, () => {
  console.log(`Web interface is running on http://localhost:${port}`);
});


// Auxiliar Functions
function generateHash(title) {
  const randomNum = Math.floor(Math.random() * 100000); // Generate a random number
  const combinedInput = title + randomNum.toString();
  
  const hash = crypto.createHash('md5');
  hash.update(combinedInput);
  return hash.digest('hex');
}