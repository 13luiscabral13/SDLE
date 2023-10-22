const shoppingLists = document.querySelector('.shopping-lists')
const createShoppingListBtn = document.getElementById('add-list')

const modal = document.getElementById('modal');
const form = document.getElementById("new-list-form");
const cancelBtn = document.getElementById('cancel-btn');

const url = "http://localhost:5000";

// -------------------------------------------------
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
setInterval(updateTime, 1000); // update every second

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

    const shareBtn = document.createElement('button')
    shareBtn.id = 'share-button'

    const shareIcon = document.createElement('i');
    shareIcon.classList.add('fas', 'fa-share'); // Add classes to the <i> element

    // Append the <i> element to the button
    shareBtn.appendChild(shareIcon);

    shareBtn.addEventListener('click', () => {
      modalWithURL(element.url)
    })

    shoppingList.appendChild(title)
    shoppingList.appendChild(deleteBtn)
    shoppingList.appendChild(shareBtn)
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
  copyButton.addEventListener('click', (e) => {
    e.preventDefault();
    // Copy the content of the input field to the clipboard
    inputField.select();
    document.execCommand('copy');
    copyButton.innerText = 'Copied'
  });

  // Append the label, input field, and copy button to the form
  form.appendChild(label);
  form.appendChild(inputField);
  form.appendChild(copyButton);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  // Append the form to the modal
  modal.appendChild(form);

  // Append the modal to the document body
  document.body.appendChild(modal);
}