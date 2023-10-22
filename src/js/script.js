const shoppingLists = document.querySelector('.shopping-lists')
const createShoppingListBtn = document.getElementById('add-list')

const modal = document.getElementById('modal');
const form = document.getElementById("new-list-form");
const cancelBtn = document.getElementById('cancel-btn');


const url = "http://localhost:5000";

createShoppingListBtn.addEventListener('click', () => {
  modal.style.display = 'block';
})

cancelBtn.addEventListener('click', () => {
  modal.style.display = 'none';
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
    // json to send to server
    const title = document.querySelector(".list-name");
    const titleText = title.value
    modal.style.display = 'none';
    console.log(titleText)
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
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-trash'); // Add classes to the <i> element

    // Append the <i> element to the button
    deleteBtn.appendChild(icon);

    deleteBtn.addEventListener('click', () => {
      //alert("Are you sure you want to delete the shopping list? This will delete it for everyone associated to it!!")
      removeList(title.textContent)
    })

    shoppingList.appendChild(title)
    shoppingList.appendChild(deleteBtn)
    shoppingLists.appendChild(shoppingList)
  });
}