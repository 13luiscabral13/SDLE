const GCounter = require('./GCounter.js');

module.exports = class AWORSet {

    constructor(owner, name, url, loaded = true) {
        this.deleted = false;
        this.loaded = loaded;
        this.owner = owner;
        this.name = name;
        this.url = url;
        this.set = []; // (element, quantity, cc)
        this.cc = [];  // (cc) = (id, version)
    }

    next() {
        const indexes = this.cc
            .filter(entry => entry[0] === this.owner && typeof entry[1] === 'number')
            .map(entry => entry[1]);
        const index = indexes.length ? Math.max(...indexes) : 0;
        return [this.owner, index + 1];
    }

    createItem(itemName) {
        if (!this.elements().includes(itemName)) {
            const d = this.next(this.cc);
            this.set.push([itemName, new GCounter(), d]);
            this.cc.push(d);
            return "Item successfully added";
        }
        return "Error: This item already exists in this list";
    }

    deleteItem(itemName) {
        this.set = this.set.filter((node) => {
            return node[0] !== itemName
        });
    }

    updateQuantities(itemName, current, total) {
        if (this.elements().includes(element)) {
            for (const [element, gcounter, causalContext] of this.set) {
                if (element === itemName) {
                    gcounter.merge({current: current, total: total});
                    return "Successfully updated";
                }
            }
        }
        return "Error: This item doesn't exist in this list";
    }

    elements() {
        return this.set.map((node) => node[0]);
    }

    info() {
        const items = Array.from(this.set).map(([itemName, gcounter, causalContext]) => {
                const totals = gcounter.info();
                return {
                    "name": itemName,
                    "current": totals.current,
                    "total": totals.total,
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

    showElements() {
        console.log(this.set);
    }

    showCC() {
        console.log(this.cc);
    }

    show(message) {
        console.log(message)
        this.showElements();
        this.showCC();
    }

    f(a, b) {

        let result = []
        for (const elementA of a) {
            const [xA, _, [wA, rA]] = elementA;
            let found = false;

            for (const elementB of b) {
                const [wB, rB] = elementB;

                if (wA === wB && rA === rB) {
                    found = true;
                }
            }

            if (!found) result.push(elementA);
        }

        return result;
    }

    merge(test) {

        const result = [];

        // set interseção set'
        for (const elementA of this.set) {
            const [xA, _, [wA, rA]] = elementA;
    
            for (const elementB of test.set) {
                const [xB, _, [wB, rB]] = elementB;
    
                if (xA === xB && wA === wB && rA === rB) {
                    result.push(elementA);
                    break;
                }
            }
        }

        // set interseção cc'
        result.push(...this.f(this.set, test.cc))

        // set' interseção cc
        result.push(...this.f(test.set, this.cc))

        this.set = Array.from(new Set([...result]));

        // cc união cc'
        this.cc = Array.from(new Set([...this.cc, ...test.cc]));
    }
}
