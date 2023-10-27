const shoppingLists = document.querySelector('.shopping-lists')
const createShoppingListBtn = document.getElementById('add-list')

const modal = document.getElementById('modal');
const form = document.getElementById("new-list-form");
const cancelBtn = document.getElementById('cancel-btn');

const port = parseInt(document.getElementById('port').textContent);
console.log('Port:', port);
const url = `http://localhost:${port}`;
console.log('URL:', url);


// -------------------------------------------------
// Must be a seperate thread doing a polling loop from the server
let ws;

function init() {
  if(ws) {
    ws.onerror = ws.onopen = ws.onclose = null
    ws.close()
  }
  
  ws = new WebSocket('ws://localhost:5000');
  ws.onopen = () => {
    console.log('Connection opened!');
  }

  ws.onmessage = function() {
    console.log(data)
  };

  ws.onclose = function() {
    ws = null
  }
}

init()
// -------------------------------------------------

createShoppingListBtn.addEventListener('click', () => {
  modal.hidden = false
})

cancelBtn.addEventListener('click', () => {
  modal.hidden = true
});

// ------------------- Adding a Shopping List -------------------
form.addEventListener("submit", function(event) {
  event.preventDefault();
  createList()
});

// ------------------- Updates the Content Every second -------------------
function updateTime() {
  getShoppingLists();
}

updateTime(); // update immediately
//setInterval(updateTime, 1000); // update every second

// ------------------- Server Part -------------------
// POST - create a new shoppingList
function createList() {
    modal.hidden = true

    const title = document.querySelector(".list-name");
    const titleText = title.value
    
    const jsonToSend = {
        title: titleText,
    }

    fetch(url + '/shoppingList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonToSend)
    })
    .then(response => response.json())
    .then(json => {
        if ('error' in json) {
          console.log('Error adding the table', error);
        } else {
          console.log('Successfully added Shopping List!');
        }
    })
    .catch(error => console.log(error));
}

// POST - removes a Shopping List
function removeList(title) {
    const jsonToSend = {
      title: title,
    }
    fetch(url + '/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonToSend)
    })
    .then(response => response.json())
    .then(json => {
        if ('error' in json) {
          console.log('Error adding the table', error);
        } else {
          console.log('Successfully deleted table!');
        }
    })
    .catch(error => console.log(error));
}

// GET - all Shopping Lists
function getShoppingLists() {
    fetch(url + '/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        display_shopping_lists(data)
    })
    .catch(error => {
        console.error(error);
    });  
}

function display_shopping_lists(data) {
  let lastChild = shoppingLists.lastElementChild;
  while(lastChild) {
    lastChild.remove()
    lastChild = shoppingLists.lastElementChild;
  }

  data.forEach(element => {
    const shoppingList = document.createElement('div')
    shoppingList.classList.add('shopping-list-item')
    
    const title = document.createElement('h1')
    title.textContent = element.title

    const divtitle = document.createElement('div')
    divtitle.id = "div-title"
    divtitle.append(title)


    const divinfo = document.createElement('div')
    divinfo.id = "div-info"
    // Create a Date object by parsing the original timestamp
    let date = new Date(element.timestamp);

    // Use Intl.DateTimeFormat to format the date as "20/10/23"
    const formattedDate = new Intl.DateTimeFormat("en-GB", { year: "2-digit", month: "2-digit", day: "2-digit" }).format(date);

    // Format the time as "09:05"
    const formattedTime = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    // Combine the date and time
    const formattedTimestamp = `${formattedDate}  ${formattedTime}`;

    const timestamp = document.createElement('h4')
    timestamp.textContent = formattedTimestamp
    timestamp.id = "timestamp"

    const deleteBtn = document.createElement('button')
    // Set the button's ID
    deleteBtn.id = 'delete-button';

    // Create an <i> element for the trash icon
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash'); // Add classes to the <i> element

    // Append the <i> element to the button
    deleteBtn.appendChild(deleteIcon);

    deleteBtn.addEventListener('click', () => {
      //alert("Are you sure you want to delete the shopping list? This will delete it for everyone associated to it!!")
      removeList(title.textContent)
    })

    divinfo.appendChild(deleteBtn)
    divinfo.appendChild(timestamp)

    shoppingList.appendChild(divtitle)
    shoppingList.appendChild(divinfo)
    shoppingLists.appendChild(shoppingList)
  });
}

function modalWithURL(url) {
  // Create the modal
  const modal = document.createElement('div');
  modal.id = 'modal';
  
  // Create the form
  const form = document.createElement('form');
  form.id = 'copy-url-form'

  // Create an input field
  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.value = url;
  inputField.id = 'url-input'

  // Create a label for the input field
  const label = document.createElement('label');
  label.innerText = 'URL';
  label.for = 'url-input'

  // Create a "Copy" button
  const copyButton = document.createElement('button');
  copyButton.innerText = 'Copy';
  copyButton.id = 'copy-button'
  copyButton.addEventListener('click', (e) => {
    e.preventDefault();
    // Copy the content of the input field to the clipboard
    inputField.select();
    document.execCommand('copy');
    copyButton.innerText = 'Copied'
  });

  const closeButton = document.createElement('button');
  closeButton.id = 'delete-button';
  const closeIcon = document.createElement('i');
  closeIcon.classList.add('fas', 'fa-close'); // Add classes to the <i> element
  // Append the <i> element to the button
  closeButton.appendChild(closeIcon);

  closeButton.addEventListener('click', () => {
    document.body.removeChild(modal);
  })

  // Append the label, input field, and copy button to the form
  form.appendChild(label);
  form.appendChild(inputField);
  form.appendChild(copyButton);
  form.appendChild(closeButton)

  form.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  // Append the form to the modal
  modal.appendChild(form);

  // Append the modal to the document body
  document.body.appendChild(modal);
}