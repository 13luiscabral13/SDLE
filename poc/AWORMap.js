import { GCounter } from "./GCounter.js";

class AWORMap {

    constructor(owner, name, url) {
        this.owner = owner;
        this.name = name;
        this.url = url;
        this.items = new Map();
    }

    createItem(itemName) {
        const item = this.items.get(itemName);
        if (!item) {
            let counter1 = new GCounter(this.owner, this.name, this.url, itemName, 'current');
            let counter2 = new GCounter(this.owner, this.name, this.url, itemName, 'total');
            this.items.set(itemName, [counter1, counter2])
            return "Item successfully added"
        }
        return "Error: This item already exists in this list";
    }

    deleteItem(itemName) {
        return "TODO ASAP";
    }

    updateQuantities(itemName, current, total) {
        let item = this.items.get(itemName);
        if (item) {
            let response = '';
            response += item[0].updateQuantity(current) + '\n';
            response += item[1].updateQuantity(total);
            return response;
        }
        return "Error: This item doesn't exist in this list";
    }
}

export { AWORMap };