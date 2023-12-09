module.exports = class GCounter {

    constructor(current = 0, total = 0) {
        this.current = current;
        this.total = total;
    }

    info() {
        return {
            current: this.current,
            total: this.total,
        };
    }

    merge(GCounter) {
        this.current = Math.max(this.current, GCounter.current);
        this.total = Math.max(this.total, GCounter.total);
        return this.info();
    }
}
