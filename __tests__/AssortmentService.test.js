const AssortmentService = require('../src/Assortment.service');

describe("AssortmentService", () => {
    test("should allow add product", () => {
        const dto = VALID_PRODUCT;
        const shopClient = {
            addProduct: jest.fn()
        };

        new AssortmentService(shopClient).addProduct(dto);

        expect(shopClient.addProduct).toHaveBeenCalledWith(dto);
    })
})

const VALID_PRODUCT = {
    name: "book",
    code: "some code",
    price: 123.45,
}