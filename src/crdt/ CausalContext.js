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
        const index = indexes.length ? Math.max(...indexes) : 0;
        return [this.id, index + 1];
    }

    add(element) {
        const d = this.next(this.cc);
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

    show(message) {
        console.log(message)
        this.showElements();
        // this.showCC();
    }

    f(a, b) {

        let result = []
        for (const elementA of a) {
            const [xA, [wA, rA]] = elementA;
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
            const [xA, [wA, rA]] = elementA;
    
            for (const elementB of test.set) {
                const [xB, [wB, rB]] = elementB;
    
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

const test1 = new Test('A');
test1.add("banana")
test1.add("maca")
test1.remove("banana")
test1.add("banana");
test1.show("Elementos iniciais de A");

const test2 = new Test('B');
test2.show("B não tem elementos");

test1.merge(test2)
test2.merge(test1)

test1.show("A depois do merge");
test2.show("B depois do merge");

test1.remove("maca");
test1.show("Agora A removeu maca")

test1.merge(test2);
test1.show("Depois de A receber o estado de B");


test1.remove("banana");
test1.add("banana")
test1.merge(test2);
test2.merge(test1);

test1.show("A removeu e adicionou banana");
test2.show("B recebeu essas atualizações")

test2.remove("banana");
test2.add("banana")
test1.merge(test2);
test2.merge(test1);

test1.show("A removeu e adicionou banana");
test2.show("B recebeu essas atualizações")


test2.remove("banana");
test2.add("morango")
test1.add("morango")
test1.merge(test2);
test2.merge(test1);

test1.show("B removeu banana e adicionou morango. A também adicionou morango");
test2.show("Estado de A")