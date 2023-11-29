import { AWORMap } from "./AWORMap.js";

class Cart {

    // this.lists = [<url, null | AWORMap>, ...]
    // if null -> deleted

    constructor(owner) {
        this.owner = owner;
        this.lists = new Map();
    }

    load(db) {
        // TODO
    }

    createList(name) {
        const url = this.getURL(name);
        let aormap = new AWORMap(this.owner, name, url);
        this.lists.set(url, aormap);
        return url;
    }

    deleteList(url) {
        // if owner = list.owner
        // this.lists.get(url) = null 
    }

    getList(url) {
        return this.lists.get(url);
    }

    getURL(listName) {
        return 'mockURL'; // TODO asap
    }
}

export { Cart };