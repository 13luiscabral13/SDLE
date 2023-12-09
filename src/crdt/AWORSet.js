const GCounter = require('./GCounter.js');

module.exports = class AWORSet {

    constructor(owner, name, url, loaded = true) {
        this.deleted = false;
        this.loaded = loaded;
        this.owner = owner;
        this.name = name;
        this.url = url;
        this.set = []; // [(element, gcounter, cc)]
        this.cc = [];  // [(cc)] = [(id, version)]
    }

    delete() {
        this.deleted = true;
        this.owner = null;
        this.name = null;
        this.set = [];
        this.cc = [];
    }

    utag() {
        const indexes = this.cc
            .filter(entry => entry[0] === this.owner && typeof entry[1] === 'number')
            .map(entry => entry[1]);
        const index = indexes.length ? Math.max(...indexes) : 0;
        return [this.owner, index + 1];
    }

    createItem(itemName, current = 0, total = 0) {
        if (!this.elements().includes(itemName)) {
            const tag = this.utag();
            this.set.push([itemName, new GCounter(current, total), tag]);
            this.cc.push(tag);
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
        if (this.elements().includes(itemName)) {
            for (let item of this.set) {
                if (item[0] === itemName) {
                    item[1].merge({current: current, total: total});
                    const newTag = this.utag()
                    item[2] = newTag;
                    this.cc.push(newTag)
                    return "Successfully updated";
                }
            }
        }
        return "Error: This item doesn't exist in this list";
    }

    elements() {
        return this.set.map((node) => node[0]);
    }

    itemInfo(itemName) {

        // a quantidade de um item é o merge dos GCounters de todos os elementos
        if (this.elements().includes(itemName)) {
            let counter = new GCounter();
            for (const [item, gcounter, cc] of this.set) {
                if (item === itemName) {
                    counter.merge(gcounter);
                }
            }

            return {
                name: itemName,
                current: counter.current,
                total: counter.total,
            }
        }
    }

    toString() {

        const cc = this.cc.map(([id, version]) => {
            return {
                id: id,
                version: version,
            }
        });

        const set = this.set.map(([item, counter, [id, version]]) => {
            return {
                name: item,
                current: counter.current,
                total: counter.total,
                id: id,
                version: version,
            };
        })

        return {
            name: this.name,
            url: this.url, 
            deleted: this.deleted,
            owner: this.owner,
            loaded: this.loaded,
            cc: cc,
            set: set,
        };  
    }

    info() {

        const items = Array.from(this.set).map(([itemName, c, cc]) => {
                return this.itemInfo(itemName);
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

    // a -> set
    // b -> cc
    preserve(a, b) {

        let result = []
        for (const elementA of a) {
            const {
                name: nameA, 
                current: currentA,
                total: totalA,
                id: ccIdA, 
                version: ccVersionA
            } = elementA;
            let found = false;

            for (const ccB of b) {
                const {id: ccIdB, version: ccVersionB} = ccB;

                if (ccIdA === ccIdA && ccVersionA === ccVersionB) {
                    found = true;
                }
            }

            if (!found) result.push(elementA);
        }

        return result.map((element) => {
            return [element.name, new GCounter(element.current, element.total), [element.id, element.version]];
        })
    }

    merge(AWORSet) {

        if (!this.loaded && AWORSet.loaded) {
            this.name = AWORSet.name;
            this.owner = AWORSet.owner;
            this.loaded = true;
        }

        const newSet = [];

        // this.set INTERSECT AWORSet.set
        for (const elementA of this.set) {
            const [nameA, gcounterA, [ccIdA, ccVersionA]] = elementA;
    
            for (const elementB of AWORSet.set) {
                const {
                    name: nameB, 
                    current: currentB, 
                    total: totalB,
                    id: ccIdB, 
                    version: ccVersionB
                } = elementB;
    
                if (nameA === nameB && ccIdA === ccIdB && ccVersionA === ccVersionB) {
                    newSet.push(elementA);
                    break;
                }
            }
        }

        // this.set INTERSECT AWORSet.cc
        newSet.push(...this.preserve(this.toString().set, AWORSet.cc))

        // AWORSet.set INTERSECT this.cc
        newSet.push(...this.preserve(AWORSet.set, this.toString().cc))

        // update internal set
        this.set =  Array.from(new Set([...newSet]
                         .map(JSON.stringify)), JSON.parse);;

        // this.causalContext UNION AWORSet.causalContext
        const externalCC = AWORSet.cc.map((cc) => [cc.id, cc.version]);
        this.cc = Array.from(new Set([...this.cc, ...externalCC]
                       .map(JSON.stringify)), JSON.parse);
    }
}
