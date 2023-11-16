const AssortmentService = require("../src/AssortmentService");

describe("AssortmentService", () => {
    test("should allow add product", () => {
        let dto = givenValidProductDto();
        let shopClient = {
            addProduct: jest.fn()
        };

        new AssortmentService(shopClient).addProduct(dto);

        expect(shopClient.addProduct).toHaveBeenCalledWith(dto);
    });

    test("should not allow to add product without code", () => {
        let dto = {
            name: "book",
            price: 123.45
        };

        let shopClient = {
            addProduct: jest.fn()
        };

        new AssortmentService(shopClient).addProduct(dto);

        expect(() => shopClient.addProduct).toThrow('Invalid product code');
    });

    function givenValidProductDto() {
        return {
            name: "book",
            code: "some code",
            price: 123.45
        };
    }
})