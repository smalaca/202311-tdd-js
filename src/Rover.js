const RIGHT = 0;
const DOWN = 1;
const LEFT = 2;
const UP = 3;

class Rover {
    constructor(x, y) {
        if (x < 0) {
            throw new Error("Invalid x: -5");
        }
        this.x = 0;
        this.y = 0;
        this.direction = RIGHT;
    }

    actualPosition() {
        return { x: this.x, y: this.y };
    }

    execute(command) {
        command.split("").forEach((letter) => {
            if (letter === "F"){
                this.moveForward();
            }

            if (letter === "R") {
                this.rotateRight();
            }

            if (letter === "L") {
                this.rotateLeft();
            }
        });
    }

    moveForward() {
        this.changePosition();
        this.recalibratePosition();
    }

    changePosition() {
        if (this.direction === RIGHT) {
            this.x += 1;
        }
        if (this.direction === DOWN) {
            this.y += 1;
        }
        if (this.direction === LEFT) {
            this.x -= 1;
        }
        if (this.direction === UP) {
            this.y -= 1;
        }
    }

    recalibratePosition() {
        if (this.y < 0) {
            this.y = 100;
        }
        if (this.y > 100) {
            this.y = 0;
        }

        if (this.x < 0) {
            this.x = 100;
        }
        if (this.x > 100) {
            this.x = 0;
        }
    }

    rotateRight() {
        this.direction = (this.direction + 1) % 4;
    }

    rotateLeft() {
        const newDirection = this.direction - 1;
        this.direction = newDirection < 0 ? UP : newDirection;
    }
}

module.exports = Rover;