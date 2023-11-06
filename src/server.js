const { time } = require('console');
const express = require('express');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const hostname = 'localhost';
const port = 5000;

/**
 * display the webpage 
 */
app.get('/', (req, res) => {
  fs.readFile('../src/index.html', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(data);
    }
  });
});

// Getting the content from index.html, css file and js files to another port
app.use(express.static('./css'));
app.use(express.static('./js'));
app.use(express.static('../src'));

app.use(function(req, res, next) {
  const allowedOrigins = ['http://localhost:5000'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


let shoppingLists = JSON.parse(fs.readFileSync('shoppingLists.json', 'utf8'));

// POST Methods
/**
 * Method to create a Shopping List
 */
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


/**
 * Method to remove a Shopping List
 */
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

/**
 * deals with errors
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// server listening on port -> port
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
