const Cart = require('./crdt/Cart.js');

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

function test7() {
    const cart1 = new Cart('5001');
    const cart2 = new Cart('5002');
    
    // inicialmente cart 1 tem a lista remota
    const url = cart1.createList("List 1");
    cart1.createItem(url, 'Leite');
    cart1.updateQuantities(url, 'Leite', 2, 10);
    cart1.createItem(url, 'Feijao');
    cart1.updateQuantities(url, 'Feijao', 1, 9);
    
    // ... e cart2 acabou de receber o url
    cart2.createList('unknown', url, 'unknown');

    console.log("Cart 1 initial state");
    console.log(cart1.toString());
    console.log("Cart 2 initial state");
    console.log(cart2.toString());
    
    // cart 1 manda a sua informação
    const receivedMessage = cart1.toString();
    cart2.merge(receivedMessage);
    
    // validar que o merge das listas em cart 2 foi bem sucedido
    console.log("\nCart 1 intermediate state");
    console.log(cart1.toString());
    console.log("Cart 2 intermediate state");
    console.log(cart2.toString());
    
    // agora cart 2 responde com a sua estrutura interna
    const sendMessage = cart2.toString();
    cart1.merge(sendMessage);
    
    // validar que os dois nós ficam com o mesmo conteúdo
    console.log("\nCart 1 final state");
    console.log(cart1.toString());
    console.log("Cart 2 final state");
    console.log(cart2.toString());
}

function test8() {
    const cart1 = new Cart('5001');
    const cart2 = new Cart('5002');
    
    // inicialmente cart 2 tem a lista remota
    const url = cart2.createList("List 1");
    cart2.createItem(url, 'Leite');
    cart2.updateQuantities(url, 'Leite', 2, 10);
    cart2.createItem(url, 'Feijao');
    cart2.updateQuantities(url, 'Feijao', 1, 9);
    
    // ... e cart1 acabou de receber o url
    cart1.createList('unknown', url, 'unknown');

    console.log("Cart 1 initial state");
    console.log(cart1.toString());
    console.log("Cart 2 initial state");
    console.log(cart2.toString());
    
    // cart 1 manda a sua informação
    const receivedMessage = cart1.toString();
    cart2.merge(receivedMessage);
    
    // validar que o merge das listas em cart 2 foi bem sucedido
    console.log("\nCart 1 intermediate state");
    console.log(cart1.toString());
    console.log("Cart 2 intermediate state");
    console.log(cart2.toString());
    
    // agora cart 2 responde com a sua estrutura interna
    const sendMessage = cart2.toString();
    cart1.merge(sendMessage);
    
    // validar que os dois nós ficam com o mesmo conteúdo
    console.log("\nCart 1 final state");
    console.log(cart1.toString());
    console.log("Cart 2 final state");
    console.log(cart2.toString());
}

function test9 () {
    const cart1 = new Cart('5001');
    const cart2 = new Cart('5002');
    
    // Cart 1 e Cart 2 têm conteúdos distintos
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
    
    // cart 1 manda a sua informação para cart 2 e recebe 'ACK'
    const response = cart2.merge(cart1.toString());
    
    console.log("Response do vizinho");
    console.log(response);
    console.log("Estado final do vizinho");
    console.log(cart2.toString());
}

function test10() {
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

    // mas cart1 (client) adiciona mais leite e o cart2 (remoto)
    // recebeu atualizações de leite também
    cart1.updateQuantities(url, 'Leite', 4, 12);
    cart2.updateQuantities(url, 'Leite', 6, 18);

    // e o cart2 (server) ainda tem mais uma lista que não interessa a cart1 (client)
    const url2 = cart2.createList('Lista Extra');
    cart2.createItem(url2, 'Uvas');
    cart2.updateQuantities(url2, 'Uvas', 6, 20);

    console.log("Client initial state");
    console.log(cart1.toString());
    
    // o client manda a sua informação para o server e recebe o seu conteúdo atualizado
    const response = cart2.merge(cart1.toString(), true); // é uma client request
    cart1.merge(response);
    
    console.log("\nResponse do server - apenas as listas que interessam ao client atual");
    console.log(response);
    console.log("Estado final do client - atualizado com a informação remota");
    console.log(cart1.toString());
}

function test() {
    // test1(); // merge de duas listas diferentes, ambas não-deleted
    // test2(); // merge de duas listas diferentes, a primeira foi deletada
    // test3(); // merge de duas listas diferentes, a segunda foi eliminada
    // test4(); // os dois carts têm a mesma lista e os mesmos itens, o primeiro deles dá update ao item
    // test5(); // os dois carts têm a mesma lista e os mesmos itens, o segundo deles dá update ao item
    // test6(); // os dois carts têm a mesma lista e os mesmos itens, mas ambos dão update aos mesmos itens e tentam sincronizar
    // test7(); // o cart1 têm a Lista 1, o cart2 remoto acaba de ter o url da Lista 1, quer saber o seu conteúdo
    // test8(); // o cart1 acaba de ter o url da Lista 1 que está só em modo remoto no cart 2, quer puxar o seu conteúdo
    // test9(); // merge na ring: server para server, expecta receber um "ACK"
    test10() // merge após proxy: client para server, expecta receber as suas listas conhecidas atualizadas
}

test()