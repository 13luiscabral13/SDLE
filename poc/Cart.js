import { AWORMap } from "./AWORMap.js";
import { v4 as uuidv4 } from 'uuid';

class Cart {

    constructor(owner) {
        this.owner = owner;
        this.lists = new Map();
    }

    async load(db) {
        return new Promise((resolve, reject) => {

            let completedSteps = 0;
            const checkCompletion = () => {
                completedSteps++;
                if (completedSteps === 2) {
                    resolve();
                }
            };
    
            // Load lists
            db.all('SELECT * FROM list', (err, rows) => {
                if (err) {
                    console.error("Error: " + err.message);
                    reject(err);
                    return;
                }
                
                for (let row of rows) {
                    this.createList(row.name, row.url);
                    if (row.deleted) this.deleteList(row.url);
                }
    
                checkCompletion();
            });
    
            // Load items
            db.all('SELECT list.name AS listname, item.* FROM list JOIN item ON list.url = item.list_url', (err, rows) => {
                if (err) {
                    console.error("Error: " + err.message);
                    reject(err);
                    return;
                }
    
                for (let row of rows) {
                    this.createItem(row.list_url, row.name);
                    this.updateQuantities(row.list_url, row.name, row.current, row.quantity);
                    if (row.deleted) this.deleteItem(row.list_url, row.name);
                }
    
                checkCompletion();
            });
        });
    }
    
    createList(name, url) {
        const id = url ?? uuidv4();
        let list = new AWORMap(this.owner, name, id);
        this.lists.set(id, list);
        return id;
    }

    deleteList(url) {
        let list = this.lists.get(url);
        if (list) { 
            if (list.owner === this.owner) {
                this.lists.set(url, null);
                return "List deleted";
            } else {
                return "Error: You don't have permissions to delete this list"
            }
        }
        return "Error: This list doesn't exist in your system";
    }

    getList(url) {
        const list = this.lists.get(url);
        return list ? list.info() : {
            url: url,
            name: null,
            deleted: true,
            items: [],
        }
    }

    createItem(url, itemName) {
        let list = this.lists.get(url);
        if (list) {
            return list.createItem(itemName);
        }
        return "Error: This list doesn't exist in your system";
    }

    deleteItem(url, itemName) {
        let list = this.lists.get(url);
        if (list) {
            return list.deleteItem(itemName);
        }
        return "Error: This list doesn't exist in your system";
    }

    updateQuantities(url, itemName, current, total) {
        let list = this.lists.get(url);
        if (list) {
            if (current > total) {
                return "Error: Current value must be less or equal to total";
            }
            return list.updateQuantities(itemName, current, total);
        }
        return "Error: This list doesn't exist in your system";
    }

    info() {
        return Array.from(
            this.lists.keys()).map((url) => this.getList(url)
        )
    }

    toString() {
        return JSON.stringify(this.info()); // será que chega? é ir testando...
    }

    merge(cartJSON) {
        const cart = JSON.parse(cartJSON);

        for (const receivedList of cart) {
            const list = this.lists.get(receivedList.url);

            // Crio a lista do meu lado
            if (!list) {
                this.createList(receivedList.name, receivedList.url);
            }

            // Se a lista recebida foi eliminada, eliminar a minha também
            if (receivedList.deleted && !list.deleted) { 
                this.deleteList(receivedList.url);
            }

            // Se não foi eliminada, dar merge aos conteúdos do meu lado
            else {
                list.merge(receivedList.items);
            }
        }

    }
}

export { Cart };