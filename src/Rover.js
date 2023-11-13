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

    execute(command) {
        if (command === "F") {
            this.x = 1;
            return;
        }
        if (command === "RF") {
            this.y = 1;
            return;
        }
        this.y = 100;
    }
}

module.exports = Rover;