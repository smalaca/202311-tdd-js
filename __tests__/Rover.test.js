const Rover = require("../src/Rover");

describe("Rover", () => {
    describe("landing", () => {
        test("should know its position", () => {
            let rover = new Rover(0, 0);

            expect(rover.actualPosition()).toStrictEqual({ x: 0, y: 0});
        });

        test("should throw Error when invalid x given", () => {
            let actual = () => new Rover(-5, 0);

            expect(actual).toThrowError(new Error("Invalid x: -5"));
        })
    });

    describe("moving", () => {
        test("should move forward", () => {
            let rover = new Rover(0, 0);

            rover.execute("F");

            expect(rover.actualPosition()).toStrictEqual({ x: 1, y: 0 });
        });

        test("should rotate right and move forward", () => {
            let rover = new Rover(0, 0);

            rover.execute("RF");

            expect(rover.actualPosition()).toStrictEqual({ x: 0, y: 1 });
        });

        test("should rotate left and move forward", () => {
            let rover = new Rover(0, 0);

            rover.execute("LF");

            expect(rover.actualPosition()).toStrictEqual({ x: 0, y: 100 });
        });

        test("should turn around and move forward", () => {
            let rover = new Rover(0, 0);

            rover.execute("RRF");

            expect(rover.actualPosition()).toStrictEqual({ x: 100, y: 0 });
        });

        test("should rotate and move multiple times", () => {
            let rover = new Rover(0, 0);

            rover.execute("FLFFRF");

            expect(rover.actualPosition()).toStrictEqual({ x: 2, y: 99 });
        });
    });
    
});