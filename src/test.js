const Cart = require('./crdt/Cart.js');

function test() {

    const cart1 = new Cart('5001');
    const cart2 = new Cart('5002');
    
    // inicialmente os dois têm a lista 1 sincronizada
    const url = cart1.createList("List 1");
    cart1.createItem(url, 'Leite');
    cart1.updateQuantities(url, 'Leite', 2, 10);
    cart1.createItem(url, 'Feijao');
    cart1.updateQuantities(url, 'Feijao', 1, 9);
    cart2.merge(cart1.toString());

    // o cart 1 adiciona mais leites, o cart2 adiciona mais leites e mais feijão
    cart1.updateQuantities(url, 'Leite', 8, 11);
    cart2.updateQuantities(url, 'Leite', 7, 18);
    cart2.updateQuantities(url, 'Feijao', 6, 10);

    cart1.merge(cart2.toString())
    cart2.merge(cart1.toString())
    
    // validar que os dois nós ficam com o mesmo conteúdo
    console.log("Cart 1 final state");
    console.log(cart1.info()[0].items);
    console.log("Cart 2 final state");
    console.log(cart2.info()[0].items);
}

test()