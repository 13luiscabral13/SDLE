const shoppingLists = document.querySelector('.shopping-lists')
const createShoppingListBtn = document.getElementById('add-list')

const modal = document.getElementById('modal');
const form = document.getElementById("new-list-form");
const cancelBtn = document.getElementById('cancel-btn');

const port = parseInt(document.getElementById('port').textContent);
const url = `http://localhost:${port}`;

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
//setInterval(updateTime, 5000); // update every second

// ------------------- Server Part -------------------
// POST - create a new shoppingList
function createList() {
    modal.hidden = true

    const title = document.querySelector(".list-name");
    const titleText = title.value
    
    const jsonToSend = {
        name: titleText
    }

    fetch(url + '/createList', {
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
function removeList(url_to_delete) {
    const jsonToSend = {
      url: url_to_delete,
    }

    fetch(url + '/deleteList', {
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
    fetch(url + '/lists', {
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

function getOneList(listUrl) {
  fetch(url + '/lists/' + listUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
    .then(data => {
        modalShoppingList(data)
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
    title.textContent = element.name
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
      removeList(element.url)
    })

    const shareBtn = document.createElement('button')
    shareBtn.id = 'share-button'

    const shareIcon = document.createElement('i');
    shareIcon.classList.add('fas', 'fa-share'); // Add classes to the <i> element
    const divbtns = document.createElement('div');

    shareBtn.addEventListener('click', () => {
      modalWithURL(element.url);
    })

    divtitle.addEventListener('click', () => {
      getOneList(element.url);
    })


    divbtns.id = "divbtns"
    // Append the <i> element to the button
    shareBtn.appendChild(shareIcon);
    divbtns.append(deleteBtn)
    divbtns.append(shareBtn)
    divinfo.appendChild(divbtns)  
    divinfo.appendChild(timestamp)

    shoppingList.appendChild(divtitle)
    shoppingList.appendChild(divinfo)
    shoppingLists.appendChild(shoppingList)
  });
}

function modalWithURL(url) {
  // Create the modal
  const modal = document.createElement('div');
  modal.id = 'modalURL';
  
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


function modalShoppingList(data) {
  const { items: dataItems, listName: dataName } = data;
  const initialArray = JSON.parse(JSON.stringify(dataItems));
  const shopList = document.getElementById("thisShoppingList");
  const ul = document.getElementById("this-list-items");
  const name = document.getElementById("this-list-name");
  var updatedArray = JSON.parse(JSON.stringify(dataItems));
  name.textContent = dataName;
  name.style.paddingTop = "10px";
  ul.innerHTML = "";
  index = -1;
  dataItems.forEach(itemData => {
    index = index+1;
    const itemDiv = document.createElement("div");
    itemDiv.style.display = "flex";
    itemDiv.style.justifyContent = "space-between";
    itemDiv.style.alignItems = "center";
    itemDiv.style.paddingRight = "25px";

    const itemP = document.createElement("div");
    const p = document.createElement("p");
    p.textContent = itemData.name;
    itemP.style.width= "11%";
    itemP.style.textAlign="left"; 
    itemP.appendChild(p);
    itemDiv.appendChild(itemP);

    const itemQuantity = document.createElement("div");
    itemQuantity.style.display = "flex";

    const itemCur = document.createElement("p");
    itemCur.textContent = itemData.current;
    itemQuantity.appendChild(itemCur);

    const itemSla = document.createElement("p");
    itemSla.style.padding = "0 10px";
    itemSla.textContent = "/";
    itemQuantity.appendChild(itemSla);

    const itemQua = document.createElement("p");
    itemQua.textContent = itemData.quantity;
    itemQuantity.appendChild(itemQua);
    itemDiv.appendChild(itemQuantity);

    const itemButtons = document.createElement("div");
    itemButtons.style.paddingTop = "5px";
    itemButtons.style.width = "14%";

    
      const addButton = createButtonWithIcon("fas fa-plus");
      const subButton = createButtonWithIcon("fas fa-minus");
      subButton.hidden = true;
      const deleteButton = createButtonWithIcon("fas fa-trash");
      const undoButton = createButtonWithIcon("fas fa-rotate-left");
      undoButton.hidden = true;

    let currentValue;
    for (key in initialArray) {
      if (initialArray[key]['name'] == itemData.name) {
        currentValue = initialArray[key]['current'];
      }
    }
    if (currentValue != itemData.quantity)  {  
      addButton.addEventListener("click", function (){
        intCur = parseInt(itemCur.textContent);
        intQua = parseInt(itemQua.textContent);
        newIntCur = intCur+1;
        itemCur.textContent = newIntCur.toString();
        for (var key in updatedArray) {
          if (updatedArray[key]['name'] == itemData.name) {
            updatedArray[key]["current"] = newIntCur;
          }
        }
        checkForChanges(initialArray, updatedArray);
        console.log("Updated Array After Change: ", updatedArray);
        if (intCur >= intQua-1) {
          addButton.hidden = true;
          return;
        }
        subButton.hidden= false;
      });
    }
    
    subButton.addEventListener("click", function (){
      intCur = parseInt(itemCur.textContent);
      newIntCur = intCur-1;
      itemCur.textContent = newIntCur.toString();
      for (var key in updatedArray) {
        if (updatedArray[key]['name'] == itemData.name) {
          updatedArray[key]["current"] = newIntCur;
        }
      }
      checkForChanges(initialArray, updatedArray); 
      if (intCur == currentValue+1) {
        subButton.hidden = true;
        return;
      }
      addButton.hidden = false;
    });
    let isSubHidden, isAddHidden;
    deleteButton.addEventListener("click", function (){
      const deleted = document.createElement("div");
      deleted.id="deleted-item-"+itemData.name; 
      const hr = document.createElement("hr");
      hr.style.borderTop = "3px dotted black";
      deleted.appendChild(hr);
      deleted.style.position = "absolute";
      deleted.style.marginTop="-5px";
      deleted.style.marginLeft="-3px";
      deleted.style.width = "48%";
      itemDiv.appendChild(deleted);
      deleteButton.hidden = true;
      undoButton.hidden = false;
      for (var key in updatedArray) {
        if (updatedArray[key]['name'] == itemData.name) {
          updatedArray.splice(key, 1);
        }
      }
      if (addButton.hidden) {
        isAddHidden = true;
      }
      else {
        isAddHidden = false;
        addButton.hidden = true;
      }
      if (subButton.hidden) {
        isSubHidden = true;
      }
      else {
        isSubHidden = false;
        subButton.hidden = true;
      }
      checkForChanges(initialArray, updatedArray);
    });
    
    undoButton.addEventListener("click", function() {
      const deleted = document.getElementById("deleted-item-"+itemData.name);
      deleted.remove();
      undoButton.hidden = true;
      deleteButton.hidden = false;
      let mylength = updatedArray.length
      updatedArray[mylength] = itemData;
      updatedArray[mylength]['current'] = parseInt(itemCur.textContent);
      addButton.hidden = isAddHidden;
      subButton.hidden = isSubHidden;
      checkForChanges(initialArray, updatedArray);
    })

    itemButtons.appendChild(addButton);
    itemButtons.appendChild(subButton);
    itemButtons.appendChild(deleteButton);
    itemButtons.appendChild(undoButton);
    itemDiv.appendChild(itemButtons);

    ul.appendChild(itemDiv);
  });

  const closeButton = createButtonWithIcon("fas fa-times");
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.cursor = "pointer";
  const checkButton = createButtonWithIcon("fas fa-check");
  checkButton.id = "saveChanges";
  checkButton.style.width = "60px";
  checkButton.style.height = "30px";
  checkButton.style.position = "absolute";
  checkButton.style.bottom = "10px";
  checkButton.style.right = "10px";
  checkButton.style.cursor = "pointer";
  checkButton.hidden=true;

  

  // Add an event listener to hide the modal when the close button is clicked
  closeButton.addEventListener("click", function () {
    shopList.hidden = true;
  });




  // Access the form inside the element
  var formInsideShoppingList = shopList.querySelector("form");


  // Append the close button to the modal
  formInsideShoppingList.appendChild(closeButton);
  formInsideShoppingList.appendChild(checkButton);

  checkButton.addEventListener("click", function () {
    processChanges(dataItems, updatedArray);
  });

  shopList.hidden = false;

  

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      shopList.hidden = true;
    }
  });
}

function checkForChanges(initialArray, updatedArray) {
  // Helper function to sort arrays of objects by their string representation
  const sortArray = (arr) => arr.slice().sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

  const sortedInitialArray = sortArray(initialArray);
  const sortedUpdatedArray = sortArray(updatedArray);

  if (JSON.stringify(sortedInitialArray) === JSON.stringify(sortedUpdatedArray)) {
    console.log("Can't find changes ;-;");
    console.log("Initial: ", initialArray);
    console.log("Updated: ", updatedArray);
    document.getElementById("saveChanges").hidden = true;
  } else {
    console.log("Found Changes! :D");
    console.log("Initial: ", initialArray);
    console.log("Updated: ", updatedArray);
    document.getElementById("saveChanges").hidden = false;
  }
}


function createButtonWithIcon(iconClasses) {
  const button = document.createElement("button");
  const icon = document.createElement("i");
  button.type = "button";
  icon.classList.add(...iconClasses.split(" "));
  button.appendChild(icon);
  return button;
}
