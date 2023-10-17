const shoppingLists = document.querySelector('.shopping-lists')

const url = "http://localhost:5000";

function updateTime() {
    getShoppingLists();
}

// ------------------- Updates the Content Every second -------------------
updateTime(); // update immediately
setInterval(updateTime, 1000); // update every second

// ------------------- Server Part -------------------
// POST - create a new shoppingList
function createList() {
    // json to send to server
    const jsonToSend = {
        title: teste,
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
function removeList() {
    fetch(url + '/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: ""
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
    description.textContent = element.title

    shoppingList.appendChild(title)
    shoppingList.appendChild(description)
    shoppingLists.appendChild(shoppingList)
  });
}