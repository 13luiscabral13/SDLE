let system = {
    s: [], // (element, cc)
    c: [], // (cc) = (id, version)
}

const node_id = "nodeA"

function next(c) {
    const index = Math.max(c.map((id, n) => {
        return (id == node_id) ? n : -1;
    })) || 0;
    return [node_id, index + 1];
}

function add(element) {
    const d = next(system.c);
    system.s.push([element, d]);
    system.c.push(d);
}

add("something")
console.log(system.s)
add("something222")
console.log(system.s)