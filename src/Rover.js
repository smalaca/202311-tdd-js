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
        } else {
            this.y = 1;
        }
    }
}

module.exports = Rover;