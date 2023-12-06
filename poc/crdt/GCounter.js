class GCounter {

    constructor(owner, listName, listURL, itemName, type = 'current' | 'total') {
        this.owner = owner;
        this.listName = listName;
        this.listURL = listURL;
        this.itemName = itemName;
        this.type = type;
        this.quantity = 0;
    }

    updateQuantity(newQuantity) {
        if (this.quantity <= newQuantity) {
            this.quantity = newQuantity;
            return `Quantity of ${this.type} ${this.itemName} has been updated`;
        }
        return "Error: Invalid update, this counter only increments";
    }

    info() {
        return this.quantity
    }

    merge(newQuantity) {
        this.quantity = Math.max(this.quantity, newQuantity);
    }
}

export { GCounter }