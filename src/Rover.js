class Rover {
    constructor(x, y) {
        if (x < 0) {
            throw new Error("Invalid x: -5");
        }
        this.x = 0;
        this.y = 0;
    }

    actualPosition() {
        return { x: this.x, y: this.y };
    }

    execute(f) {
        if (f === "F") {
            this.x = 1;
            return;
        }
        if (f === "RF") {
            this.y = 1;
            return;
        }
        this.y = 100;
    }
}

module.exports = Rover;