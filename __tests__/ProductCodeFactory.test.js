const ProductCodeFactory = require("../src/ProductCodeFactory")

describe('ProductCodeFactory', () => {
    const factory = new ProductCodeFactory();

    test('should start with name when contains only alphanumeric characters and have 15 character length', () => {
        let actual = factory.create("1t15Pr0ductN4m3");

        expect(actual.startsWith("1t15Pr0ductN4m3")).toBeTruthy();
    });

    test('should replace space with "-" in used part of product name', () => {
        let actual = factory.create("Pr0duct    N4m3");

        expect(actual.startsWith("Pr0duct----N4m3")).toBeTruthy();
    });

    test('should use only first 15 characters from product name', () => {
        let actual = factory.create("ThisIsTooLongProductName");

        expect(actual.startsWith("ThisIsTooLongPr")).toBeTruthy();
        expect(actual).not.toContain("ThisIsTooLongProductName");
    });

})