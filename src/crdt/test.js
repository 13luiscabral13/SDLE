const AWORSet = require('./AWORSet.js');

let list1 = new AWORSet('Fabio', 'List A', 'something.com');

list1.createItem("banana");
list1.updateQuantities("banana", 1, 2);
list1.createItem("maca");
list1.updateQuantities("maca", 2, 4);
list1.deleteItem("banana")
list1.createItem("banana");
list1.updateQuantities("banana", 4, 6);

let list2 = new AWORSet('Fabio', 'List A', 'something.com');

list2.createItem("banana");
list2.updateQuantities("banana", 1, 2);
list2.createItem("maca");
list2.updateQuantities("maca", 2, 4);
list2.deleteItem("banana")
list2.createItem("banana");
list2.updateQuantities("banana", 4, 6);
list2.createItem("grape");

list1.merge(list2.toString());
console.log(list1.toString())