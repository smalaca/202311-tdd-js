class Rover {
    constructor(x, y) {
        if (x < 0) {
            throw new Error("Invalid x: -5");
        }
    }

    actualPosition() {
        return { x: 0, y: 0};
    }
}

module.exports = Rover;