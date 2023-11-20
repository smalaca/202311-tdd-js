const ProductCodeFactory = require("../src/ProductCodeFactory")

describe('ProductCodeFactory', () => {
    const factory = new ProductCodeFactory();

    test('should start with name when contains only alphanumeric characters and have 15 character length', () => {
        let actual = factory.create("1t15Pr0ductN4m3");

        expect(actual.startsWith("1t15Pr0ductN4m3")).toBeTruthy();
    });

})