class GCounter {

    constructor(owner, listName, listURL, itemName, type = 'current' | 'total') {
        this.owner = owner;
        this.listName = listName;
        this.listURL = listURL;
        this.itemName = itemName;
        this.type = type;
        this.quantity = 0;
    }

    
}

export { GCounter }