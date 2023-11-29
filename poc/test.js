import { Cart } from "./Cart.js";
import sqlite3 from 'sqlite3';
import util from 'util';

const db = new sqlite3.Database('../database/mock.db');

const cart = new Cart('5002');
await cart.load(db);
console.log(util.inspect(cart, { showHidden: false, depth: null }));




/*
const url1 = cart.createList('List A');

console.log(cart.createItem(url1, "bananas"));
console.log(cart.createItem(url1, "cenouras"));
console.log(cart.updateQuantities(url1, "bananas", 6, 7));
console.log(cart.updateQuantities(url1, "bananas", 1, 2));

console.log(util.inspect(cart, { showHidden: false, depth: null }));
*/