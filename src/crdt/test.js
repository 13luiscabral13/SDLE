const AWORSet = require('./AWORSet.js');

let list = new AWORSet('Fabio', 'List A', 'https//something.com');
list.show("Estado inicial");

list.createItem("banana");
list.updateQuantities("banana", 1, 2);
list.show("Banana")

list.createItem("maca");
list.updateQuantities("maca", 2, 4);
list.show("Maça")

list.deleteItem("nem existe")
list.deleteItem("banana")


list.createItem("banana");
list.updateQuantities("banana", 4, 6);

console.log(list.toString());