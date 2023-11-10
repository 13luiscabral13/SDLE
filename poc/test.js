import { CRDT } from "./CRDT.js";
import sqlite3 from 'sqlite3';

// Instanciation
let c = new CRDT('ze');
const db = new sqlite3.Database('../database/mock.db');
c.load(db);

console.log(c.getState())

/*
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
*/