const AWORSet = require('./AWORSet.js');

let list = new AWORSet('Fabio', 'List A', "https//something.com");
list.show("Estado inicial");

list.createItem("banana");
list.show("Criou banana");
console.log(list.info())