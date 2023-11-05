import { CRDT } from "./CRDT.js";

let c = new CRDT();
c.createList("url_da_lista_A", "Lista A");
c.createItem("url_da_lista_A", "leite", 10);
c.createItem("url_da_lista_A", "maças", 4, 2);

console.log(c.getDeltaState())