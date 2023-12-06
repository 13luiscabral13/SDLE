import { Cart } from "./Cart.js";
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('../database/mock.db');

const cart = new Cart('5002');
await cart.load(db);

const url = cart.createList("List A");
cart.createItem(url, 'Leite');
cart.updateQuantities(url, 'Leite', 4, 9);
console.log(cart.getList(url));

cart.deleteList(url);

console.log(cart.info())