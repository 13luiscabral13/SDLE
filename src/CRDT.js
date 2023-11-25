module.exports = class CRDT {

    constructor() {
        this.activeLists = new Map();
        this.deletedLists = new Set();
        this.changed = false;
    }

    createList(url, name) {
        let newList = new Map();
        newList.set('name', name);
        newList.set('changed', true);
        newList.set('activeItems', new Map());
        newList.set('deletedItems', new Set());
        this.activeLists.set(url, newList);
        this.changed = true;
    }

    deleteList(url) {
        this.deletedLists.add(url);
        this.changed = true;
    }   

    getKnownLists() {
        return Array.from(
            new Set([...this.activeLists.keys(), ...this.deletedLists])
        );
    }

    createItem(url, name, total, quantity = 0) {
        if (this.activeLists.has(url)) {
            const list = this.activeLists.get(url);
            if (!list.get('activeItems').has(name)) {
                list.get('activeItems').set(name, {
                    changed: true,
                    quantity,
                    total,
                });
                list.set('changed', true);
            }
        }
        this.changed = true;
    } 

    updateItem(url, name, quantity) {
        if (this.activeLists.has(url)) {
            const list = this.activeLists.get(url);
            if (list.get('activeItems').has(name) && !list.get('deletedItems').has(name)) {
                const item = list.get('activeItems').get(name);
                item.quantity = quantity;
                item.changed = true;
                list.set('changed', true);
            }
        }
        this.changed = true;
    }

    deleteItem(url, name) {
        if (this.activeLists.has(url)) {
            const list = this.activeLists.get(url);
            if (list.get('activeItems').has(name)) {
                list.set('changed', true);
                list.get('deletedItems').add(name);
            }
        }
        this.changed = true;
    }

    hasChanges() {
        return this.changed;
    }

    resetChangedState() {
        this.activeLists.forEach((list) => {
            list.set('changed', false);
            list.get('activeItems').forEach((item) => {
                item.changed = false;
            });
        });
    }

    getState() {
        const serializedState = {
            activeLists: Array.from(this.activeLists.entries()).map(([url, list]) => {
                return {
                    url,
                    name: list.get('name'),
                    changed: list.get('changed'),
                    activeItems: Array.from(list.get('activeItems').entries()).map(([itemName, item]) => {
                        return {
                            name: itemName,
                            changed: item.changed,
                            quantity: item.quantity,
                            total: item.total,
                        };
                    }),
                    deletedItems: Array.from(list.get('deletedItems')),
                };
            }),
            deletedLists: Array.from(this.deletedLists),
            knownLists: this.getKnownLists(),
        };
        return JSON.stringify(serializedState, null, 2);
    }

    getDeltaState() {
        const deltaState = {
            activeLists: Array.from(this.activeLists.entries()).filter(([_, list]) => {
                return list.get('changed') || Array.from(list.get('activeItems').values()).some(item => item.changed);
            }).map(([url, list]) => {
                return {
                    url,
                    name: list.get('name'),
                    changed: list.get('changed'),
                    activeItems: Array.from(list.get('activeItems').entries()).filter(([_, item]) => item.changed).map(([itemName, item]) => {
                        return {
                            name: itemName,
                            changed: item.changed,
                            quantity: item.quantity,
                            total: item.total,
                        };
                    }),
                    deletedItems: Array.from(list.get('deletedItems')),
                };
            }),
            deletedLists: Array.from(this.deletedLists),
            knownLists: this.getKnownLists(),
        };
        this.resetChangedState();
        this.changed = false;
        return JSON.stringify(deltaState, null, 2);
    }

    merge(response) {
        // o argumento terá sempre 2 partes
        // uma lista das listas conhecidas
        // o delta CRDT do sistema
        // verificar este comportamento
    }
}
