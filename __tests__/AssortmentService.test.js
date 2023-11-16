const AssortmentService = require("./AssortmentService");

describe("AssortmentService", () => {
    const SHOP_CLIENT = {
        addProduct: jest.fn()
    };
    const ASSORTMENT_SERVICE = new AssortmentService(SHOP_CLIENT);

    test("should allow add product", () => {
        let dto = givenValidProductDto();

        ASSORTMENT_SERVICE.addProduct(dto);

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
