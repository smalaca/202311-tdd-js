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
});