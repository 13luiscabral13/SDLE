const GCounter = require('./GCounter.js');

module.exports = class AWORMap {

    constructor(owner, name, url, loaded = true) {
        this.deleted = false;
        this.loaded = loaded;
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

    info() {
        const items = Array.from(
            this.items.keys()).map((key) => {
                const item = this.items.get(key);
                return {
                    "name": key,
                    "deleted": false, // TODO
                    "current": item[0].info(),
                    "total": item[1].info(),
                };
            }
        )

        return {
            name: this.name,
            url: this.url, 
            deleted: this.deleted,
            owner: this.owner,
            loaded: this.loaded,
            items: items,
        };  
    }

    toString() {
        const items = Array.from(
            this.items.keys()).map((key) => {
                const item = this.items.get(key);
                return {
                    "name": key,
                    "deleted": false, // TODO
                    "current": item[0].info(),
                    "total": item[1].info(),
                };
            }
        )

        return {
            name: this.name,
            url: this.url, 
            deleted: this.deleted,
            owner: this.owner,
            loaded: this.loaded,
            items: items,
        }; 
    }

    merge(list) {

        if (!this.loaded && list.loaded) {
            this.name = list.name;
            this.owner = list.owner;
            this.loaded = true;
        }

        for (const receivedItem of list.items) {
            const item = this.items.get(receivedItem.name);

            // o item não foi eliminado dos dois lados, apenas um update é necessário
            if (item && !receivedItem.deleted && !item.deleted) {
                item[0].merge(receivedItem.current);
                item[1].merge(receivedItem.total);
            }

            // o item é novo nesta lista, adiciona-o
            else if (!item && !receivedItem.deleted) {
                this.createItem(receivedItem.name);
                this.updateQuantities(receivedItem.name, receivedItem.current, receivedItem.total);
            }

            // recebeu um update num item que já estava eliminado aqui
            else if (0) {
                // TODO
            }

            // recebeu que alguém eliminou um item que ainda não estava eliminado aqui
            else if (0) {
                // TODO
            }
        }

    }

    delete() {
        this.deleted = true;
        this.owner = null;
        this.name = null;
        this.items = [];
    }
}
