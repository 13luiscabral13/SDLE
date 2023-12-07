const shoppingLists = document.querySelector('.shopping-lists')
const createShoppingListBtn = document.getElementById('add-list')
const joinShoppingListBtn = document.getElementById('join-list')

const modal = document.getElementById('modal');
const modal_join = document.getElementById('modal_join');

const form = document.getElementById("new-list-form");
const cancelBtn = document.getElementById('cancel-btn');
const canceljoinBtn = document.getElementById('cancel-join-btn');

const port = parseInt(document.getElementById('port').textContent);
const url = `http://localhost:${port}`;

// -------------------------------------------------
// Must be a seperate thread doing a polling loop from the server
let ws;

function init() {
  if (ws) {
    ws.onerror = ws.onopen = ws.onclose = null
    ws.close()
  }

  ws = new WebSocket('ws://localhost:5000');
  ws.onopen = () => {
    console.log('Connection opened!');
  }

  ws.onmessage = function () {
    console.log(data)
  };

  ws.onclose = function () {
    ws = null
  }
}

init()
// -------------------------------------------------

createShoppingListBtn.addEventListener('click', () => {
  modal.hidden = false
})
joinShoppingListBtn.addEventListener('click', () => {
  modal_join.hidden = false
})
canceljoinBtn.addEventListener('click', () => {
  modal_join.hidden = true
})
cancelBtn.addEventListener('click', () => {
  modal.hidden = true
});

// ------------------- Adding a Shopping List -------------------
form.addEventListener("submit", function (event) {
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
  while (lastChild) {
    lastChild.remove()
    lastChild = shoppingLists.lastElementChild;
  }

  data.forEach(element => {
    const shoppingList = document.createElement('div')
    shoppingList.classList.add('shopping-list-item')
    shoppingList.id = "shopping-list-name-" + element.name;
    const title = document.createElement('h1')
    title.textContent = element.name
    const divtitle = document.createElement('div')
    divtitle.id = "div-title"
    divtitle.append(title)

    const divinfo = document.createElement('div')
    divinfo.id = "div-info"
    // Create a Date object by parsing the original timestamp
    let date = new Date(element.timestamp);

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
      checkremoveList(element.url, element.name);
    })

    function checkremoveList(url, name) {
      // Create modal container
      const modalDel = document.createElement("div");
      modalDel.classList.add("modal");
      modalDel.id = "modalDel";
      // Create content for the modal
      const modalContent = document.createElement("div");
      modalContent.classList.add("modal-content");

      // Create text for the modal
      const modalText1 = document.createElement("p");
      modalText1.style.marginTop = "0px";
      modalText1.textContent = `Are you sure you want to remove ${name}?`;
      const modalText2 = document.createElement("p");
      modalText2.style.margin = "-15px";
      modalText2.textContent = `This will delete it for everyone associated to it!!`;
      const modalText3 = document.createElement("p");
      modalText3.style.marginTop = "15px";
      modalText3.style.marginBottom = "0px";
      modalText3.style.color = "red";
      modalText3.style.fontSize = "15px";
      modalText3.textContent = `(This action is irreversible)`;







      // Create "Yes" button
      const yesBtn = document.createElement("button");
      yesBtn.textContent = "Yes";
      yesBtn.addEventListener("click", () => {
        // Handle the removal logic, e.g., call a function to delete the item
        removeList(url);
        document.getElementById("shopping-list-name-" + name).remove();
        modalDel.style.display = "none"; // Close the modal after handling removal
      });

      // Create "No" button
      const noBtn = document.createElement("button");
      noBtn.textContent = "No";
      noBtn.addEventListener("click", () => {
        modalDel.style.display = "none"; // Close the modal without removing the item
      });

      // Append elements to the modal content
      modalContent.appendChild(modalText1);
      modalContent.appendChild(modalText2);
      modalContent.appendChild(modalText3);
      modalContent.appendChild(yesBtn);
      modalContent.appendChild(noBtn);

      // Append modal content to the modal container
      modalDel.appendChild(modalContent);

      // Append modal container to the document body
      document.body.appendChild(modalDel);

      // Display the modal
      modalDel.style.display = "block";
      // TODO: complete function
    }

    const shareBtn = document.createElement('button')
    shareBtn.id = 'share-button'

    const shareIcon = document.createElement('i');
    shareIcon.classList.add('fas', 'fa-share'); // Add classes to the <i> element
    const divbtns = document.createElement('div');

    shareBtn.addEventListener('click', () => {
      modalWithURL(element.url, element.name);
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

    shoppingList.appendChild(divtitle)
    shoppingList.appendChild(divinfo)
    shoppingLists.appendChild(shoppingList)
  });
}

function modalWithURL(url, listName) {
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
  label.innerText = 'Share ' + listName + ' with your friends!';
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

  const closedButton = createButtonWithIcon("fas fa-times");
  closedButton.id = "closed-button"
  closedButton.addEventListener('click', function () {
    modal.remove();
  })
  const labelClose = document.createElement('div');
  labelClose.style.display = "flex";
  labelClose.style.justifyContent = "space-between";
  labelClose.style.marginBottom = "15px";
  labelClose.appendChild(label);
  labelClose.appendChild(closedButton);
  // Append the label, input field, and copy button to the form
  form.appendChild(labelClose);
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


function createThisItem(itemData, initialArray, updatedArray) {
  console.log(itemData);
  const itemDiv = document.createElement("div");
  itemDiv.style.display = "flex";
  itemDiv.style.justifyContent = "space-between";
  itemDiv.style.alignItems = "center";
  itemDiv.style.paddingRight = "25px";

  const itemP = document.createElement("div");
  const p = document.createElement("p");
  p.textContent = itemData.name;
  itemP.style.width = "11%";
  itemP.style.textAlign = "left";
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
  if (currentValue == null) {
    currentValue = 0;
  }
  if (currentValue != itemData.quantity) {
    addButton.addEventListener("click", function () {
      intCur = parseInt(itemCur.textContent);
      intQua = parseInt(itemQua.textContent);
      console.log("Cur: ", intCur, " Qua: ", intQua);
      newIntCur = intCur + 1;
      itemCur.textContent = newIntCur.toString();
      for (var key in updatedArray) {
        if (updatedArray[key]['name'] == itemData.name) {
          updatedArray[key]["current"] = newIntCur;
        }
      }
      checkForChanges(initialArray, updatedArray);
      if (intCur >= intQua - 1) {
        addButton.hidden = true;
        if (intQua == 1) {
          subButton.hidden = false;
        }
        return;
      }
      subButton.hidden = false;
    });
  }

  subButton.addEventListener("click", function () {
    intCur = parseInt(itemCur.textContent);
    newIntCur = intCur - 1;
    itemCur.textContent = newIntCur.toString();
    for (var key in updatedArray) {
      if (updatedArray[key]['name'] == itemData.name) {
        updatedArray[key]["current"] = newIntCur;
      }
    }
    checkForChanges(initialArray, updatedArray);
    if (intCur == currentValue + 1) {
      subButton.hidden = true;
      if (intCur == 1) {
        addButton.hidden = false;
      }
      return;
    }
    addButton.hidden = false;
  });
  let isSubHidden, isAddHidden;
  deleteButton.addEventListener("click", function () {
    const deleted = document.createElement("div");
    deleted.id = "deleted-item-" + itemData.name;
    const hr = document.createElement("hr");
    hr.style.borderTop = "3px dotted black";
    deleted.appendChild(hr);
    deleted.style.position = "absolute";
    deleted.style.marginTop = "-5px";
    deleted.style.marginLeft = "-3px";
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

  undoButton.addEventListener("click", function () {
    const deleted = document.getElementById("deleted-item-" + itemData.name);
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

  itemQua.addEventListener("click", (event) => {
    itemQua.contentEditable = true;
  });
  let lastText = "";

  function checkInteger(text) {
    if (!/^\d+$/m.test(text)) {
      return true;
    }
    else return false;
  }

  function checkSmaller(change, quantity) {
    return (change < quantity);
  }

  function convert(text) {
    let extracted = text.match(/\d+/g)
    let result = extracted ? extracted.join("") : null;
    return result;
  }

  function changeArray(text) {
    for (var key in updatedArray) {
      if (updatedArray[key]['name'] == itemData.name) {
        updatedArray[key]['quantity'] = parseInt(text);
      }
    }
  }
  itemQua.addEventListener("keydown", (event) => {
    console.log(event.key);
    if (event.key === "Enter") {
      console.log("Enter was pressed");
      // Check if the Enter key was pressed
      let text = convert(itemQua.innerText);
      if (checkInteger(text)) {
        itemQua.innerText = itemData.quantity;
        itemQua.contentEditable = false; // Disable contentEditable
        alert("Please input only integers")
      }
      else if (checkSmaller(parseInt(text), itemData.quantity)) {
        itemQua.innerText = itemData.quantity;
        itemQua.contentEditable = false; // Disable contentEditable
        alert("The new value must be bigger than the previous")
      }
      else {
        itemQua.innerText = text;
        itemQua.contentEditable = false; // Disable contentEditable
        changeArray(text);
        console.log("Updated Array: ", updatedArray);
        checkForChanges(initialArray, updatedArray);
      }
    }
  });



  itemButtons.appendChild(addButton);
  itemButtons.appendChild(subButton);
  itemButtons.appendChild(deleteButton);
  itemButtons.appendChild(undoButton);
  itemDiv.appendChild(itemButtons);
  return itemDiv;
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
    index = index + 1;
    const itemDiv = createThisItem(itemData, initialArray, updatedArray);
    ul.appendChild(itemDiv);
  }
  );

  let createDiv = addCreateDiv(ul, "");
  ul.appendChild(createDiv);

  function createAddItemModal() {
    // Create the modal element
    const modalAddItem = document.createElement("div");
    modalAddItem.id = "modalAddItem";
    modalAddItem.className = "modalAddItem";
    // Create the form element
    const modalForm = document.createElement("form");
    modalForm.id = "addItemForm";
    modalForm.style.backgroundColor = "white";
    modalForm.style.textAlign = "center";
    modalForm.style.width = "25%"; // Use percentage for responsiveness
    modalForm.style.maxWidth = "400px"; // Set a maximum width for larger screens
    modalForm.style.height = "15%"; // Use percentage for responsiveness
    modalForm.style.position = "relative"; // Set position to relative
    modalForm.style.padding = "15px";

    const modalHeader = document.createElement("h3");
    modalHeader.textContent = "What will the new item be?";
    modalHeader.style.fontWeight = "normal";

    modalHeader.style.marginTop = "10px";
    // Create input fields and labels
    const itemNameLabel = document.createElement("label");
    itemNameLabel.textContent = "Name";
    itemNameLabel.style.fontWeight = "normal";
    itemNameLabel.style.textAlign = "left";
    const itemNameInput = document.createElement("input");
    itemNameLabel.style.fontSize = "14px";
    itemNameLabel.style.display = "flex";

    const itemQuantityGoalLabel = document.createElement("label");
    itemQuantityGoalLabel.textContent = "Quantity";
    itemQuantityGoalLabel.style.fontSize = "14px";
    itemQuantityGoalLabel.style.textAlign = "left";
    itemQuantityGoalLabel.style.fontWeight = "normal";

    const itemQuantityGoalInput = document.createElement("input");
    itemQuantityGoalInput.style.width = "20%";
    itemQuantityGoalInput.style.display = "flex";
    itemQuantityGoalInput.style.marginLeft = "4px";
    // Create close button with icon
    const closeAddItem = createButtonWithIcon("fas fa-times");
    closeAddItem.addEventListener("click", function () {
      // Close the modal when the close button is clicked
      modalAddItem.remove();
    });

    // Create submit button with icon
    const submitButton = createButtonWithIcon("fas fa-check");
    submitButton.style.marginTop = "5%";
    // Set position to absolute and place on the top right
    closeAddItem.style.position = "absolute";
    closeAddItem.style.top = "10px";
    closeAddItem.style.right = "10px";

    const itemName = document.createElement("div");
    const itemQuantity = document.createElement("div");
    const inputsDiv = document.createElement("div");

    itemName.appendChild(itemNameLabel);
    itemName.appendChild(itemNameInput);

    itemQuantity.appendChild(itemQuantityGoalLabel);
    itemQuantity.appendChild(itemQuantityGoalInput);

    itemName.style.marginRight = "30px";
    inputsDiv.appendChild(itemName);
    inputsDiv.appendChild(itemQuantity);
    inputsDiv.appendChild(submitButton);

    inputsDiv.style.display = "flex";
    inputsDiv.style.marginTop = "5%";
    inputsDiv.style.justifyContent = "center";
    inputsDiv.style.alignItems = "center";

    // Append labels, input fields, and buttons to the form
    modalForm.appendChild(modalHeader);
    modalForm.appendChild(inputsDiv);
    modalForm.appendChild(closeAddItem);

    // Append the form to the modal
    modalAddItem.appendChild(modalForm);

    // Append the modal to the body of the document
    document.body.appendChild(modalAddItem);

    submitButton.addEventListener("click", function () {
      if (!checkIfItemExists(itemNameInput.value.trim(), updatedArray)) {
        if (itemNameInput.value.trim() != "" && /^\d+$/.test(itemQuantityGoalInput.value.trim())) {
          if (parseInt(itemQuantityGoalInput.value.trim()) <= 0) {
            alert("The quantity cannot be a non-positive integer!");
            console.log("Error!");
          }
          else {
            console.log("Name: ", itemNameInput.value, " Quantity: ", itemQuantityGoalInput.value);
            let newItem = { "name": itemNameInput.value, "deleted": false, "current": 0, "quantity": parseInt(itemQuantityGoalInput.value) }
            modalAddItem.remove();
            addToArray(newItem, updatedArray, initialArray);
            const newitemdiv = createThisItem(newItem, initialArray, updatedArray);
            ul.appendChild(newitemdiv);
            createDiv = addCreateDiv(ul, createDiv)
            ul.appendChild(createDiv);
          }

        }
        else if (itemNameInput.value.trim() == "" && /^\d+$/.test(itemQuantityGoalInput.value.trim())) {
          alert("Please fill a name!")
          console.log("Error!");
        }
        else if (itemNameInput.value.trim() != "" && !/^\d+$/.test(itemQuantityGoalInput.value.trim())) {
          alert("Quantity can only be an integer!")
          console.log("Error!");
        }
        else {
          alert("The name cannot be empty and the quantity must be an integer!")
          console.log("Error!");
        }
      }
      else {
        alert("You can't create an already created item...");
        console.log("Error!");
      }
    })

    const mediaQuery = window.matchMedia("(max-width: 600px)");
    function checkIfItemExists(name, array) {
      console.log("Checking if ", name, " exists in ", array);
      for (var key in array) {
        if (array[key]['name'] == name) {
          return true;
        }
      }
      return false;
    }
    function handleMediaQueryChange(e) {
      if (e.matches) {
        // Adjust styles for smaller screens
        modalForm.style.width = "90%";
        modalForm.style.height = "80%";
        // ... (adjust other styles as needed)
      } else {
        // Revert to original styles for larger screens
        modalForm.style.width = "50%";
        modalForm.style.height = "20%";
        // ... (revert other styles as needed)
      }
    }

    // Initial check
    handleMediaQueryChange(mediaQuery);
  }

  function addToArray(newItem, updatedArray, initialArray) {
    updatedArray[updatedArray.length] = newItem;
    checkForChanges(initialArray, updatedArray);
  }
  function addCreateDiv(ul, createDiv) {
    if (createDiv != "") {
      createDiv.remove();
    }
    createDiv = document.createElement("div");
    const createItemP = document.createElement("p");
    const createItem = createButtonWithIcon("fas fa-plus");
    createDiv.style.marginTop = "-5px";
    createItem.style.marginRight = "5px";
    createDiv.style.display = "flex";
    createDiv.style.alignItems = "center";
    createItemP.textContent = "Add Item";
    createItem.addEventListener("click", function () {
      createAddItemModal(dataName);
    });
    createDiv.appendChild(createItem);
    createDiv.appendChild(createItemP);
    return createDiv;
  }


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
  checkButton.hidden = true;



  // Add an event listener to hide the modal when the close button is clicked
  closeButton.addEventListener("click", function () {
    shopList.hidden = true;
    checkButton.hidden = true;
  });




  // Access the form inside the element
  var formInsideShoppingList = shopList.querySelector("form");


  // Append the close button to the modal
  formInsideShoppingList.appendChild(closeButton);
  formInsideShoppingList.appendChild(checkButton);

  checkButton.addEventListener("click", function () {
    allchanges = compareArrays(initialArray, updatedArray);
    console.log(allchanges);
    const jsonToSend = {
      addedChanges: changes    
    }
    console.log(jsonToSend);
    fetch(url + '/changeItems', {
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
          console.log('Successfully Received the Changes');
        }
      })
      .catch(error => console.log(error));
  });

  shopList.hidden = false;
}



function checkForChanges(initialArray, updatedArray) {
  // Helper function to sort arrays of objects by their string representation
  const sortArray = (arr) => arr.slice().sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

  const sortedInitialArray = sortArray(initialArray);
  const sortedUpdatedArray = sortArray(updatedArray);

  if (JSON.stringify(sortedInitialArray) === JSON.stringify(sortedUpdatedArray)) {
    console.log("Can't find changes");
    console.log("Initial: ", initialArray);
    console.log("Updated: ", updatedArray);
    document.getElementById("saveChanges").hidden = true;
  } else {
    console.log("Found Changes!");
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

function checkIfInArray(name, array) {
  for (var key in array) {
    if (array[key]['name'] == name) {
      return key;
    }
  }
  return -1;
}

function setDifference(setA, setB) {
  let difference = new Set(setA);
  setB.forEach(element => {
    difference.delete(element);
  });
  return difference;
}

function compareArrays(initialArray, updatedArray) {
  let addedElements = [];
  const removedElements = [];
  const updatedElements = [];

  let updatedArraySet = new Set(updatedArray);

  let passedUpdatedElements = new Set();
  for (var key in initialArray) {
    var keyUp = checkIfInArray(initialArray[key]['name'], updatedArray); // Key in updatedArray
    if (keyUp != -1) { // if in updated Array
      if (JSON.stringify(initialArray[key]) != JSON.stringify(updatedArray[keyUp])) { /* if different in both arrays */
        updatedElements.push(initialArray[key])
      }
      passedUpdatedElements.add(updatedArray[keyUp]);
    }
    else { /* not in updated */
      removedElements.push(initialArray[key])
    }
  }

  let addedElementsSet = setDifference(updatedArraySet, passedUpdatedElements);
  addedElements = Array.from(addedElementsSet);
  return ([addedElements, removedElements, updatedElements]);
}
