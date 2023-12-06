import { Cart } from "./Cart.js";
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('../database/mock.db');

const cart = new Cart('5002');
await cart.load(db);

const url = cart.createList("List A");
console.log(url);
console.log(cart.getList(url)); // acertar este output

console.log(cart.info())