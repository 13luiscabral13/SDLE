const shoppingLists = document.querySelector('.shopping-lists')
const createShoppingListBtn = document.getElementById('add-list')

const url = "http://localhost:5000";

function updateTime() {
    getShoppingLists();
}

createShoppingListBtn.addEventListener('click', () => {

  createList()
})

// ------------------- Updates the Content Every second -------------------
updateTime(); // update immediately
setInterval(updateTime, 1000); // update every second

// ------------------- Server Part -------------------
// POST - create a new shoppingList
function createList() {
    // json to send to server
    const jsonToSend = {
        title: "teste",
        text: "Shopping list para teste"
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
function removeList(title, description) {
  console.log(title, description)
    const jsonToSend = {
      title: title,
      text: description
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
    fetch(url + '/get', {
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

    const description = document.createElement('p')
    description.textContent = element.text

    const deleteBtn = document.createElement('button')
    // Set the button's ID
    deleteBtn.id = 'delete-button';

    // Create an <i> element for the trash icon
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-trash'); // Add classes to the <i> element

    // Append the <i> element to the button
    deleteBtn.appendChild(icon);

    deleteBtn.addEventListener('click', () => {
      //alert("Are you sure you want to delete the shopping list? This will delete it for everyone associated to it!!")
      removeList(title.textContent, description.textContent)
    })

    shoppingList.appendChild(title)
    shoppingList.appendChild(description)
    shoppingList.appendChild(deleteBtn)
    shoppingLists.appendChild(shoppingList)
  });
}