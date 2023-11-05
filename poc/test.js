import { CRDT } from "./CRDT.js";

let c = new CRDT();
c.createList("url_da_lista_A", "Lista A");
c.createList("url_da_lista_B", "Lista B");
console.log("-------------------");
console.log(c.getDeltaState());

c.createItem("url_da_lista_A", "maças", 4, 2);
console.log("-------------------");
console.log(c.getDeltaState());

c.deleteItem("url_da_lista_A", "maças");
console.log("-------------------");
console.log(c.getDeltaState());

console.log("-------------------");
console.log(c.getDeltaState());

console.log("-------------------");
console.log(c.getState());