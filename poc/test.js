import { Cart } from "./Cart.js";
import sqlite3 from 'sqlite3';
import * as flatted from 'flatted';
import serialize from 'serialize-javascript'

const db = new sqlite3.Database('../database/mock.db');

const cart = new Cart('5002');
await cart.load(db);

console.log(cart)

const stringCart = serialize(cart);
function deserialize(serializedJavascript){
  return eval('(' + serializedJavascript + ')');
}

const newCart = deserialize(stringCart);
console.log(newCart.getList('ss'))


// console.log(cart.getList('url/bonito/com'))



/*
console.log(util.inspect(cart, { showHidden: false, depth: null }));
console.log(cart.knownLists())
const url1 = cart.createList('List A');

console.log(cart.createItem(url1, "bananas"));
console.log(cart.createItem(url1, "cenouras"));
console.log(cart.updateQuantities(url1, "bananas", 6, 7));
console.log(cart.updateQuantities(url1, "bananas", 1, 2));

console.log(util.inspect(cart, { showHidden: false, depth: null }));
*/