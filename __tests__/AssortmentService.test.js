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

    function givenValidProductDto() {
        return {
            name: "book",
            code: "some code",
            price: 123.45
        };
    }
})