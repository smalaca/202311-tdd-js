const Rover = require("../src/Rover");

describe("Rover", () => {
    test("should know its position", () => {
        let rover = new Rover(0, 0);

        expect(rover.actualPosition()).toStrictEqual({ x: 0, y: 0});
    });
});