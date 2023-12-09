const AWORMap = require('./AWORMap.js');
const { v4: uuidv4 } = require('uuid');

module.exports = class Cart {

    constructor(owner) {
        this.owner = owner;
        this.lists = new Map();
        this.hasChange = true;
    }

    // Load old data from local database
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
                    this.createList(row.name, row.url, row.owner);
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
    
    createList(name, url = null, owner = null, loaded = true) {
        this.hasChange = true;
        const id = url ?? uuidv4();
        const own = owner ?? this.owner;
        let list = new AWORMap(own, name, id, loaded);
        this.lists.set(id, list);
        return id;
    }

    deleteList(url) {
        this.hasChange = true;
        let list = this.lists.get(url);
        if (list) list.delete();
    }


    // Get list info in JSON format
    getList(url) {
        const list = this.lists.get(url);
        return list ? list.info() : {
            url: url,
            name: null,
            owner: null,
            deleted: true,
            items: [],
        }
    }

    createItem(url, itemName) {
        this.hasChange = true;
        let list = this.lists.get(url);
        if (list) {
            return list.createItem(itemName);
        }
        return "Error: This list doesn't exist in your system";
    }

    deleteItem(url, itemName) {
        this.hasChange = true;
        let list = this.lists.get(url);
        if (list) {
            return list.deleteItem(itemName);
        }
        return "Error: This list doesn't exist in your system";
    }

    updateQuantities(url, itemName, current, total) {
        console.log("Updating: ", itemName, " with current: ", current, " and total: ", total);
        this.hasChange = true;
        let list = this.lists.get(url);
        if (list) {
            if (current > total) {
                return "Error: Current value must be less or equal to total";
            }
            return list.updateQuantities(itemName, current, total);
        }
        return "Error: This list doesn't exist in your system";
    }

    // Information about all Cart content
    info() {
        return Array.from(
            this.lists.keys()).map((url) => this.getList(url)
        )
    }

    getListToString(url) {
        const list = this.lists.get(url);
        return list ? list.toString() : {
            owner: null,
            url: url,
            name: null,
            deleted: true,
            items: [],
        }
    }

    toString(knownLists = null) {

        let listsToInclude;

        if (knownLists === null) {
            listsToInclude = Array.from(this.lists.keys());
        } else if (Array.isArray(knownLists)) {
            listsToInclude = knownLists.filter(url => this.lists.has(url));
        }

        return JSON.stringify(
            listsToInclude.map(url => this.getListToString(url))
        );
    }

    merge(cartString, clientRequest = false) {
        this.hasChange = true;
        const cart = JSON.parse(cartString);

        for (const receivedList of cart) {
            let list = this.lists.get(receivedList.url);

            // Crio a lista do meu lado
            if (!list) {
                this.createList(receivedList.name, receivedList.url, receivedList.owner, receivedList.loaded);
                list = this.lists.get(receivedList.url);
            }

            // Se a lista recebida foi eliminada, eliminar a minha também
            // Se a lista recebida não foi eliminada mas eu tenho elimiminada, deixar como está
            if ((receivedList.deleted && !list.deleted) || (!receivedList.deleted && list.deleted)) {
                this.deleteList(receivedList.url);
            }

            // Se não foi eliminada, dar merge aos conteúdos do meu lado
            else {
                list.merge(receivedList);
            }
        }

        if (clientRequest) {
            const knownLists = Array.from(cart.map((entry) => entry.url));
            return this.toString(knownLists);
        } else {
            return 'ACK';
        }
    }

    changed() {
        const state = this.hasChange;
        this.hasChange = false;
        return state;
    }
}