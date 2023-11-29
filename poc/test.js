import { Cart } from "./Cart.js";
import sqlite3 from 'sqlite3';

// Instanciation
// let c = new CRDT('ze');
// const db = new sqlite3.Database('../database/mock.db');
// c.load(db);

const cart = new Cart('5002');
const url = cart.createList('a minha lista com nome lindo');
console.log(url);


console.log(cart.getList(url))