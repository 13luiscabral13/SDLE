class Test {

    constructor(id) {
        this.id = id;
        this.set = []; // (element, cc)
        this.cc = [];  // (cc) = (id, version)
    }

    next() {
        const indexes = this.cc
        .filter(entry => entry[0] === this.id && typeof entry[1] === 'number')
        .map(entry => entry[1]);
        console.log(indexes)
        const index = indexes.length ? Math.max(...indexes) : 0;
        console.log(index)
        return [this.id, index + 1];
    }

    add(element) {
        const d = this.next(this.cc);
        console.log(d)
        this.set.push([element, d]);
        this.cc.push(d);
    }

    remove(element) {
        this.set = this.set.filter((node) => {
            return node[0] !== element
        });
    }

    elements() {
        return this.set.map((node) => node[0]);
    }

    showElements() {
        console.log(this.set);
    }

    showCC() {
        console.log(this.cc);
    }

    merge(test) {

    }
}

const test = new Test('unique');

test.add("banana")
test.add("maca")

test.remove("banana")
test.showElements();
test.showCC();

console.log("\n")

test.add("banana");
test.showElements();
test.showCC();