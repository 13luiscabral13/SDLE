import { Cart } from "./Cart.js";
import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('../database/mock.db');

const cart1 = new Cart('5001');
const cart2 = new Cart('5002');

const url1 = cart1.createList("List 1");
cart1.createItem(url1, 'Leite');
cart1.updateQuantities(url1, 'Leite', 2, 10);

const url2 = cart2.createList("List 2");
cart2.createItem(url2, 'Massa');
cart2.updateQuantities(url2, 'Massa', 1, 7);

// cart 1 manda a sua informação
const receivedMessage = cart1.toString();

// cart 2 recebe a informação de um nó
cart2.merge(receivedMessage);

// validar que o merge das listas foi bem sucedido
console.log(cart2.info())