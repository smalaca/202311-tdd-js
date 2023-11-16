const AssortmentService = require("./AssortmentService");

describe("AssortmentService", () => {
    const SHOP_CLIENT = {
        addProduct: jest.fn()
    };

    test("should allow add product", () => {
        let dto = givenValidProductDto();

        new AssortmentService(SHOP_CLIENT).addProduct(dto);

        expect(SHOP_CLIENT.addProduct).toHaveBeenCalledWith(dto);
    });

    function givenValidProductDto() {
        return {
            name: "book",
            code: "some code",
            price: 123.45
        };
    }
})
