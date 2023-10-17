const express = require('express');
const fs = require('fs');

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


let shoppingList = JSON.parse(fs.readFileSync('shoppingLists.json', 'utf8'));

// POST Methods
/**
 * Method to create a Shopping List
 */
app.post('/shoppingList', (req, res, next) => { 
  const title = req.body.title
  const text = req.body.text
  shoppingList.push({id: shoppingList.length, title: title, text: text})
  fs.writeFileSync('shoppingLists.json', JSON.stringify(shoppingList));
  
  console.log(shoppingList)
  res.status(200).end()
})

/**
 * Method to remove a Shopping List
 */
app.post('/delete', (req, res, next) => {
    shoppingList.pop()
    fs.writeFileSync('shoppingLists.json', JSON.stringify(shoppingList));
  
    console.log(shoppingList)
    res.status(200).end()
})


// GET Methods
app.get('/get', (req, res, next) => {
  //console.log(shoppingList)
  res.json(shoppingList)
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
