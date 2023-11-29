import { Cart } from "./Cart.js";
import sqlite3 from 'sqlite3';

// Instanciation
// let c = new CRDT('ze');
// const db = new sqlite3.Database('../database/mock.db');
// c.load(db);

const cart1 = new Cart('5002');
const cart2 = new Cart('5003');

const url = cart1.createList('a minha lista com nome lindo');
console.log(url);
console.log(cart1.getList(url))
console.log(cart1.deleteList(url))
console.log(cart1.deleteList("url que não existe"))