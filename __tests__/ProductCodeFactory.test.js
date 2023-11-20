const ProductCodeFactory = require("../src/ProductCodeFactory")

describe('ProductCodeFactory', () => {
    const factory = new ProductCodeFactory();

    describe('should start with product name', () => {
        test('when product contains only alphanumeric characters and have 15 character length', () => {
            let actual = factory.create("1t15Pr0ductN4m3");

            expect(actual.startsWith("1t15Pr0ductN4m3")).toBeTruthy();
        });
    });

})