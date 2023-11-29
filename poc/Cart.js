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
                    console.error(err.message);
                    reject(err);
                    return;
                }
    
                for (let row of rows) {
                    this.createList(row.name, row.url);
                }
    
                checkCompletion();
            });
    
            // Load items
            db.all('SELECT list.name AS listname, item.* FROM list JOIN item ON list.url = item.list_url', (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                    return;
                }
    
                for (let row of rows) {
                    this.createItem(row.list_url, row.name);
                    this.updateQuantities(row.list_url, row.name, row.current, row.quantity);
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
                return "You don't have permissions to delete this list"
            }
        }
        return "This list doesn't exist in your system";
    }

    getList(url) {
        return this.lists.get(url);
    }

    createItem(url, itemName) {
        let list = this.lists.get(url);
        if (list) {
            return list.createItem(itemName);
        }
        return "This list doesn't exist in your system";
    }

    deleteItem(url, itemName) {
        let list = this.lists.get(url);
        if (list) {
            return list.deleteItem(itemName);
        }
        return "This list doesn't exist in your system";
    }

    updateQuantities(url, itemName, current, total) {
        let list = this.lists.get(url);
        if (list) {
            if (current > total) {
                return "Current must be less or equal to total";
            }
            return list.updateQuantities(itemName, current, total);
        }
        return "This list doesn't exist in your system";
    }
}

export { Cart };