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

        const assortmentService = new AssortmentService(shopClient);

        expect(() => assortmentService.addProduct(dto)).toThrow('Invalid product code');
    });

    test("should not allow to add product without name", () => {
        let dto = {
            code: "some code",
            price: 123.45
        };

        let shopClient = {
            addProduct: jest.fn()
        };

        const assortmentService = new AssortmentService(shopClient);

        expect(() => assortmentService.addProduct(dto)).toThrow('Invalid product name');
    });

    function givenValidProductDto() {
        return {
            name: "book",
            code: "some code",
            price: 123.45
        };
    }
})