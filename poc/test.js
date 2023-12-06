import { Cart } from "./crdt/Cart.js";
import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('../database/mock.db');

function test1() {
    const cart1 = new Cart('5001');
    const cart2 = new Cart('5002');
    
    const url1 = cart1.createList("List 1");
    cart1.createItem(url1, 'Leite');
    cart1.updateQuantities(url1, 'Leite', 2, 10);
    
    const url2 = cart2.createList("List 2");
    cart2.createItem(url2, 'Massa');
    cart2.updateQuantities(url2, 'Massa', 1, 7);
    
    console.log("Cart 1 initial state");
    console.log(cart1.toString());
    console.log("Cart 2 initial state");
    console.log(cart2.toString());
    
    // cart 1 manda a sua informação
    const receivedMessage = cart1.toString();
    cart2.merge(receivedMessage);
    
    // validar que o merge das listas em cart 2 foi bem sucedido
    console.log("Cart 1 intermediate state");
    console.log(cart1.toString());
    console.log("Cart 2 intermediate state");
    console.log(cart2.toString());
    
    // agora cart 2 responde com a sua estrutura interna
    const sendMessage = cart2.toString();
    cart1.merge(sendMessage);
    
    // validar que os dois nós ficam com o mesmo conteúdo
    console.log("Cart 1 final state");
    console.log(cart1.toString());
    console.log("Cart 2 final state");
    console.log(cart2.toString());
}

function test2() {
    const cart1 = new Cart('5001');
    const cart2 = new Cart('5002');
    
    const url1 = cart1.createList("List 1");
    cart1.createItem(url1, 'Leite');
    cart1.updateQuantities(url1, 'Leite', 2, 10);
    cart1.deleteList(url1);
    
    const url2 = cart2.createList("List 2");
    cart2.createItem(url2, 'Massa');
    cart2.updateQuantities(url2, 'Massa', 1, 7);
    
    console.log("Cart 1 initial state");
    console.log(cart1.toString());
    console.log("Cart 2 initial state");
    console.log(cart2.toString());
    
    // cart 1 manda a sua informação
    const receivedMessage = cart1.toString();
    cart2.merge(receivedMessage);
    
    // validar que o merge das listas em cart 2 foi bem sucedido
    console.log("Cart 1 intermediate state");
    console.log(cart1.toString());
    console.log("Cart 2 intermediate state");
    console.log(cart2.toString());
    
    // agora cart 2 responde com a sua estrutura interna
    const sendMessage = cart2.toString();
    cart1.merge(sendMessage);
    
    // validar que os dois nós ficam com o mesmo conteúdo
    console.log("Cart 1 final state");
    console.log(cart1.toString());
    console.log("Cart 2 final state");
    console.log(cart2.toString());
}

function test3() {
    const cart1 = new Cart('5001');
    const cart2 = new Cart('5002');
    
    const url1 = cart1.createList("List 1");
    cart1.createItem(url1, 'Leite');
    cart1.updateQuantities(url1, 'Leite', 2, 10);
    
    const url2 = cart2.createList("List 2");
    cart2.createItem(url2, 'Massa');
    cart2.updateQuantities(url2, 'Massa', 1, 7);
    cart2.deleteList(url2);
    
    console.log("Cart 1 initial state");
    console.log(cart1.toString());
    console.log("Cart 2 initial state");
    console.log(cart2.toString());
    
    // cart 1 manda a sua informação
    const receivedMessage = cart1.toString();
    cart2.merge(receivedMessage);
    
    // validar que o merge das listas em cart 2 foi bem sucedido
    console.log("Cart 1 intermediate state");
    console.log(cart1.toString());
    console.log("Cart 2 intermediate state");
    console.log(cart2.toString());
    
    // agora cart 2 responde com a sua estrutura interna
    const sendMessage = cart2.toString();
    cart1.merge(sendMessage);
    
    // validar que os dois nós ficam com o mesmo conteúdo
    console.log("Cart 1 final state");
    console.log(cart1.toString());
    console.log("Cart 2 final state");
    console.log(cart2.toString());
}

function test4() {
    const cart1 = new Cart('5001');
    const cart2 = new Cart('5002');
    
    // inicialmente os dois têm a lista 1 sincronizada
    const url = cart1.createList("List 1");
    cart1.createItem(url, 'Leite');
    cart1.updateQuantities(url, 'Leite', 2, 10);
    cart1.createItem(url, 'Feijao');
    cart1.updateQuantities(url, 'Feijao', 1, 9);
    cart2.createList('List 1', url, cart1.owner);
    cart2.createItem(url, 'Leite');
    cart2.updateQuantities(url, 'Leite', 2, 10);
    cart2.createItem(url, 'Feijao');
    cart2.updateQuantities(url, 'Feijao', 1, 9);

    // o cart1 dá update às quantidades de leite
    cart1.updateQuantities(url, 'Leite', 8, 11);
    
    console.log("Cart 1 initial state");
    console.log(cart1.toString());
    console.log("Cart 2 initial state");
    console.log(cart2.toString());
    
    // cart 1 manda a sua informação
    const receivedMessage = cart1.toString();
    cart2.merge(receivedMessage);
    
    // validar que o merge das listas em cart 2 foi bem sucedido
    console.log("Cart 1 intermediate state");
    console.log(cart1.toString());
    console.log("Cart 2 intermediate state");
    console.log(cart2.toString());
    
    // agora cart 2 responde com a sua estrutura interna
    const sendMessage = cart2.toString();
    cart1.merge(sendMessage);
    
    // validar que os dois nós ficam com o mesmo conteúdo
    console.log("Cart 1 final state");
    console.log(cart1.toString());
    console.log("Cart 2 final state");
    console.log(cart2.toString());
}

function test5() {
    const cart1 = new Cart('5001');
    const cart2 = new Cart('5002');
    
    // inicialmente os dois têm a lista 1 sincronizada
    const url = cart1.createList("List 1");
    cart1.createItem(url, 'Leite');
    cart1.updateQuantities(url, 'Leite', 2, 10);
    cart1.createItem(url, 'Feijao');
    cart1.updateQuantities(url, 'Feijao', 1, 9);
    cart2.createList('List 1', url, cart1.owner);
    cart2.createItem(url, 'Leite');
    cart2.updateQuantities(url, 'Leite', 2, 10);
    cart2.createItem(url, 'Feijao');
    cart2.updateQuantities(url, 'Feijao', 1, 9);

    // o cart2 dá update às quantidades de leite
    cart2.updateQuantities(url, 'Leite', 8, 11);
    
    console.log("Cart 1 initial state");
    console.log(cart1.toString());
    console.log("Cart 2 initial state");
    console.log(cart2.toString());
    
    // cart 1 manda a sua informação
    const receivedMessage = cart1.toString();
    cart2.merge(receivedMessage);
    
    // validar que o merge das listas em cart 2 foi bem sucedido
    console.log("Cart 1 intermediate state");
    console.log(cart1.toString());
    console.log("Cart 2 intermediate state");
    console.log(cart2.toString());
    
    // agora cart 2 responde com a sua estrutura interna
    const sendMessage = cart2.toString();
    cart1.merge(sendMessage);
    
    // validar que os dois nós ficam com o mesmo conteúdo
    console.log("Cart 1 final state");
    console.log(cart1.toString());
    console.log("Cart 2 final state");
    console.log(cart2.toString());
}

function test6() {
    const cart1 = new Cart('5001');
    const cart2 = new Cart('5002');
    
    // inicialmente os dois têm a lista 1 sincronizada
    const url = cart1.createList("List 1");
    cart1.createItem(url, 'Leite');
    cart1.updateQuantities(url, 'Leite', 2, 10);
    cart1.createItem(url, 'Feijao');
    cart1.updateQuantities(url, 'Feijao', 1, 9);
    
    cart2.createList('List 1', url, cart1.owner);
    cart2.createItem(url, 'Leite');
    cart2.updateQuantities(url, 'Leite', 2, 10);
    cart2.createItem(url, 'Feijao');
    cart2.updateQuantities(url, 'Feijao', 1, 9);

    // o cart 1 adiciona mais leites, o cart2 adiciona mais leites e mais feijão
    cart1.updateQuantities(url, 'Leite', 8, 11);
    cart2.updateQuantities(url, 'Leite', 7, 18);
    cart2.updateQuantities(url, 'Feijao', 6, 10);

    console.log("Cart 1 initial state");
    console.log(cart1.toString());
    console.log("Cart 2 initial state");
    console.log(cart2.toString());
    
    // cart 1 manda a sua informação
    const receivedMessage = cart1.toString();
    cart2.merge(receivedMessage);
    
    // validar que o merge das listas em cart 2 foi bem sucedido
    console.log("Cart 1 intermediate state");
    console.log(cart1.toString());
    console.log("Cart 2 intermediate state");
    console.log(cart2.toString());
    
    // agora cart 2 responde com a sua estrutura interna
    const sendMessage = cart2.toString();
    cart1.merge(sendMessage);
    
    // validar que os dois nós ficam com o mesmo conteúdo
    console.log("Cart 1 final state");
    console.log(cart1.toString());
    console.log("Cart 2 final state");
    console.log(cart2.toString());
}

function test() {
    // test1(); // merge de duas listas diferentes, ambas não-deleted
    // test2(); // merge de duas listas diferentes, a primeira foi deletada
    // test3(); // merge de duas listas diferentes, a segunda foi eliminada
    // test4();// os dois carts têm a mesma lista e os mesmos itens, o primeiro deles dá update ao item
    // test5(); // os dois carts têm a mesma lista e os mesmos itens, o segundo deles dá update ao item
    // test6(); // os dois carts têm a mesma lista e os mesmos itens, mas ambos dão update aos mesmos itens e tentam sincronizar
}

test()