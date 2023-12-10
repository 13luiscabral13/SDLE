const shoppingLists = document.querySelector('.shopping-lists')
const createShoppingListBtn = document.getElementById('add-list')
const joinShoppingListBtn = document.getElementById('join-list')
const joinForm = document.getElementById('join-list-form')

const modal = document.getElementById('modal');
const modal_join = document.getElementById('modal_join');

const form = document.getElementById("new-list-form");
const cancelBtn = document.getElementById('cancel-btn');
const canceljoinBtn = document.getElementById('cancel-join-btn');

const port = parseInt(document.getElementById('port').textContent);
const url = `http://localhost:${port}`;

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


function joinList() {
  console.log("Entered join list");
  const listUrl = document.getElementById('join-list-name').value;
  const jsonToSend = {
    listUrl: listUrl
  }
  fetch(url + '/joinList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonToSend)
  })
    .then(response => response.json())
    .then(json => {
      if (json.message == "Joined the List") {
        createErrorPopup("Trying to join the Shopping List...");
        let myElm = {name: json.list.name, url: json.url};
        shoppingLists.append(createNotLoadedShoppingList());

      } else {
        createErrorPopup("Couldn't join the Shopping List");
      }
    })
    .catch(error => console.log(error));
    modal_join.hidden = true;
  }


// ------------------- Adding a Shopping List -------------------
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const title = document.getElementById("create-list-name");
  const titleText = title.value
  let shoppingLists = document.querySelectorAll('.shopping-list-item');
  console.log(shoppingLists);
  if (shoppingLists.length != 0) {
    for (var key in shoppingLists) {
      if (shoppingLists[key].getAttribute('id').split('shopping-list-name-')[1] == titleText) {
        createErrorPopup("You can't create a list with the same name!");
        return;
      }
    }
  }
  createList(titleText)
});

// ------------------- Joining a Shopping List -------------------

joinForm.addEventListener("submit", function (event) {
  event.preventDefault();
  joinList()
});


// ------------------- Updates the Content Every second -------------------
function updateTime() {
  console.log("Refreshed!");
  getShoppingLists();
}

updateTime(); // update immediately
setInterval(updateTime, 5000); // update every second

// ------------------- Server Part -------------------
// POST - create a new shoppingList

function createSuccessPopup(successText) {
  const modalSuccess = document.createElement("div");
  const modalClose = createButtonWithIcon("fas fa-times");
  modalClose.style.position = "absolute";
  modalClose.style.top = "10px";
  modalClose.style.right = "10px";
  modalClose.style.cursor = "pointer";
  modalClose.addEventListener("click", function () {
    modalSuccess.remove();
  });
  modalSuccess.classList.add("modal");
  modalSuccess.style.zIndex = "1001";
  modalSuccess.id = "modalSuccess";
  // Create content for the modal
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modalContent.style.width = "30%";
  modalContent.style.height = "20%";
  modalContent.style.textAlign = "center";
  modalContent.style.padding = "15px";
  modalContent.style.backgroundColor = "white";
  modalContent.style.borderRadius = "5px";
  modalContent.style.position = "relative";
  const modalText = document.createElement("p");
  modalText.textContent = successText;
  modalText.style.fontFamily = "Arial, sans-serif";
  modalText.style.fontSize = "18px";
  modalText.style.color = "blue";
  modalText.style.fontWeight = "bold";
  modalContent.appendChild(modalText);
  modalContent.appendChild(modalClose);
  modalSuccess.appendChild(modalContent);
  document.body.appendChild(modalSuccess);
}


function createErrorPopup(errorText) {
  const modalError = document.createElement("div");
  const modalClose = createButtonWithIcon("fas fa-times");
  modalClose.style.position = "absolute";
  modalClose.style.top = "10px";
  modalClose.style.right = "10px";
  modalClose.style.cursor = "pointer";
  modalClose.addEventListener("click", function () {
    modalError.remove();
  });
  modalError.classList.add("modal");
  modalError.style.zIndex = "1001";
  modalError.id = "modalError";
  // Create content for the modal
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modalContent.style.width = "30%";
  modalContent.style.height = "20%";
  modalContent.style.textAlign = "center";
  modalContent.style.padding = "15px";
  modalContent.style.backgroundColor = "white";
  modalContent.style.borderRadius = "5px";
  modalContent.style.position = "relative";
  const modalText = document.createElement("p");
  modalText.textContent = errorText;
  modalText.style.fontFamily = "Arial, sans-serif";
  modalText.style.fontSize = "18px";
  modalText.style.color = "red";
  modalText.style.fontWeight = "bold";
  modalContent.appendChild(modalText);
  modalContent.appendChild(modalClose);
  modalError.appendChild(modalContent);
  document.body.appendChild(modalError);
}

function createList(titleText) {
  modal.hidden = true


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
      if (json.message == "Created the List") {
        console.log('Successfully created ' + titleText + '!');
        let myElm = {name: titleText, url: json.url};
        shoppingLists.append(createShoppingList(myElm));
      } else {
        createErrorPopup("Couldn't create " + titleText + "!");
      }
    })
    .catch(error => console.log(error));
}

// POST - removes a Shopping List
function removeList(url_to_delete, name) {
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
      if (json.message == "You are not the owner of this list") {
        createErrorPopup("You are not the owner of list " + name + "!" );
      }
      else {
        createSuccessPopup("Successfully deleted " + name + "!");
        document.getElementById("shopping-list-name-" + name).remove();
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

function getOneList(listUrl, reload) {
  fetch(url + '/lists/' + listUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      if (!reload) {
        let initialArray = JSON.parse(JSON.stringify(data.items));
        var updatedArray = JSON.parse(JSON.stringify(data.items));      
        modalShoppingList(data, listUrl, initialArray, updatedArray);
      }
      else {
        let initialArray = JSON.parse(JSON.stringify(data.items));
        let updatedArray = JSON.parse(JSON.stringify(data.items));
        let checkButton = document.getElementById("check-button");
        if (checkButton != null) {
          checkButton.remove();
        }
        let modalAdd = document.getElementById("modalAddItem");
        if (modalAdd != null) {
          modalAdd.remove();
        }
        reloadList(data, initialArray, updatedArray)
      }
    })
    .catch(error => {
      console.error(error);
    });
}

function createNotLoadedShoppingList() {
  const shoppingList = document.createElement('div')
  shoppingList.classList.add('shopping-list-item')
  shoppingList.id = "shopping-list-name-WaitingForLoad";
  const title = document.createElement('h1')
  title.textContent = "Waiting for load";
  const divtitle = document.createElement('div')
  divtitle.id = "div-title"
  divtitle.append(title)
  const divinfo = document.createElement('div')
  divinfo.id = "div-info"
  shoppingList.appendChild(divtitle)
  shoppingList.appendChild(divinfo)
  return shoppingList;
}

function createShoppingList(element, owner) {
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
    const deleteBtn = document.createElement('button')
    // Set the button's ID
    deleteBtn.id = 'delete-button';

    // Create an <i> element for the trash icon
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash'); // Add classes to the <i> element
    if (parseInt(owner) !== port) {
      const ownerText = document.createElement('p');
      ownerText.textContent = `(${owner})`;
      ownerText.style.fontSize = "12px";
      ownerText.style.overflow = "hidden";
      ownerText.style.margin = "0px";
      ownerText.style.textOverflow = "ellipsis";
      ownerText.style.whiteSpace = "nowrap";
      divtitle.appendChild(ownerText);
    }

      // Append the <i> element to the button
      deleteBtn.appendChild(deleteIcon);

      deleteBtn.addEventListener('click', () => {
        //alert("Are you sure you want to delete the shopping list? This will delete it for everyone associated to it!!")
        checkremoveList(element.url, element.name);
      })

    function checkremoveList(url, name) {
      if (document.getElementById("modalDel") == null) {
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
        // Handle the removal logic, e.g., call a function to delete the list
        removeList(url, name);
        modalDel.remove();
      });

      // Create "No" button
      const noBtn = document.createElement("button");
      noBtn.textContent = "No";
      noBtn.addEventListener("click", () => {
        modalDel.remove();
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
      getOneList(element.url, false);
    })


    divbtns.id = "divbtns"
    // Append the <i> element to the button
    shareBtn.appendChild(shareIcon);
    divbtns.append(deleteBtn)
    divbtns.append(shareBtn)
    divinfo.appendChild(divbtns)

    shoppingList.appendChild(divtitle)
    shoppingList.appendChild(divinfo)
    return shoppingList;
}

function display_shopping_lists(data) {

  let lastChild = shoppingLists.lastElementChild;
  while (lastChild) {
    lastChild.remove()
    lastChild = shoppingLists.lastElementChild;
  }

  data.forEach(element => {
    if (!element.deleted) {
      if (element.loaded) {
        let shoppingList = createShoppingList(element, element.owner);
        shoppingLists.appendChild(shoppingList)
      }
      else {
        let shoppingList = createNotLoadedShoppingList();
        shoppingLists.appendChild(shoppingList)
      }
    }
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
  console.log("Entered createThisItem: ", updatedArray, initialArray);
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
  itemQua.textContent = itemData.total;
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
  if (currentValue != itemData.total) {
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
        updatedArray[key]['total'] = parseInt(text);
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
        itemQua.innerText = itemData.total;
        itemQua.contentEditable = false; // Disable contentEditable
        alert("Please input only numbers")
      }
      else if (checkSmaller(parseInt(text), itemData.total)) {
        itemQua.innerText = itemData.total;
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

function reloadList(iniData, updatedArray, initialArray) {
  console.log("Entered reloadList: ", updatedArray, initialArray);
  const { items: dataItems, listName: dataName } = iniData;
  const ul = document.getElementById("this-list-items");
  ul.innerHTML = ""; // Remove all items inside the UL
  ul.style.height = "90%";
  ul.style.overflowY = "scroll";
  index = -1;
  dataItems.forEach(itemData => {
    index = index + 1;
    const itemDiv = createThisItem(itemData, initialArray, updatedArray, initialArray);
    ul.appendChild(itemDiv);
  });
  let createDiv = addCreateDiv(ul, "", dataName, updatedArray, initialArray);
  ul.appendChild(createDiv);
}
function addCreateDiv(ul, createDiv, dataName, updatedArray, initialArray) {
  console.log("Entered addCreateDiv: ", updatedArray, initialArray);
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
  createDiv.appendChild(createItem);
  createDiv.appendChild(createItemP);
  createItem.addEventListener("click", function () {
    createAddItemModal(ul, dataName, updatedArray, initialArray, createDiv);
  });
  return createDiv;
}

function createAddItemModal(ul, dataName, updatedArray, initialArray, createDiv) {
  console.log("Entered createAddItemModal: ", updatedArray, initialArray)
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
          alert("The quantity cannot be a non-positive number!");
          console.log("Error!");
        }
        else {
          console.log("Name: ", itemNameInput.value, " Quantity: ", itemQuantityGoalInput.value);
          let newItem = { "name": itemNameInput.value, "deleted": false, "current": 0, "total": parseInt(itemQuantityGoalInput.value) }
          modalAddItem.remove();
          addToArray(newItem, updatedArray, initialArray);
          const newitemdiv = createThisItem(newItem, initialArray, updatedArray);
          ul.appendChild(newitemdiv);
          createDiv = addCreateDiv(ul, createDiv, dataName, updatedArray, initialArray)
          ul.appendChild(createDiv);
        }

      }
      else if (itemNameInput.value.trim() == "" && /^\d+$/.test(itemQuantityGoalInput.value.trim())) {
        alert("Please fill a name!")
        console.log("Error!");
      }
      else if (itemNameInput.value.trim() != "" && !/^\d+$/.test(itemQuantityGoalInput.value.trim())) {
        alert("Quantity can only be an number!")
        console.log("Error!");
      }
      else {
        alert("The name cannot be empty and the quantity must be an number!")
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
function modalShoppingList(data, listUrl, initialArray, updatedArray) {
  setInterval(function () {
    console.log("reloadList");
    getOneList(listUrl, true);
  }, 10000);

  const { items: dataItems, listName: dataName } = data;
  const shopList = document.getElementById("thisShoppingList");
  shopList.setAttribute("data-url", listUrl);
  const ul = document.getElementById("this-list-items");
  const name = document.getElementById("this-list-name");
  name.textContent = dataName;
  name.style.paddingTop = "10px";
  ul.innerHTML = "";
  ul.style.height = "90%";
  ul.style.overflowY = "scroll";
  index = -1;
  dataItems.forEach(itemData => {
    index = index + 1;
    const itemDiv = createThisItem(itemData, initialArray, updatedArray);
    ul.appendChild(itemDiv);
  }
  );

  let createDiv = addCreateDiv(ul, "", dataName, updatedArray, initialArray);
  ul.appendChild(createDiv);
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
    updatedArray = initialArray;
    shopList.hidden = true;
    checkButton.hidden = true;
    return;
  });

  // Access the form inside the element
  var formInsideShoppingList = shopList.querySelector("form");

  // Append the close button to the modal
  formInsideShoppingList.appendChild(closeButton);
  formInsideShoppingList.appendChild(checkButton);

  

  checkButton.addEventListener("click", function () {
    allchanges = compareArrays(initialArray, updatedArray);
    console.log(allchanges);
    const urlShop = shopList.getAttribute("data-url");
    const jsonToSend = {
      changes: allchanges,
      listUrl: urlShop
    }
    fetch(url + '/changeItems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonToSend)
    })
      .then(response => response.json())
      .then(json => {
        if (json.message == "Correctly changed items") {
          initialArray = updatedArray;
          checkButton.hidden = true;
          createSuccessPopup("Successfully changed the list!");
        } else {
          createErrorPopup("Couldn't change the list!");
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
        updatedElements.push(updatedArray[keyUp])
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
