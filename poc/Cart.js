import { AWORMap } from "./AWORMap.js";
import { v4 as uuidv4 } from 'uuid';

class Cart {

    constructor(owner) {
        this.owner = owner;
        this.lists = new Map();
    }

    load(db) {
        // TODO
    }

    createList(name) {
        const url = uuidv4();
        let list = new AWORMap(this.owner, name, url);
        this.lists.set(url, list);
        return url;
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
        return "This list doesn't exists in your system";
    }

    getList(url) {
        return this.lists.get(url);
    }

    createItem(url, itemName) {
        let list = this.lists.get(url);
        if (list) {
            return list.createItem(itemName);
        }
        return "This list doesn't exists in your system";
    }
}

export { Cart };