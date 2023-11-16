const AssortmentService = require('../src/Assortment.service');
const shopClient = {
    addProduct: jest.fn()
};

describe("AssortmentService", () => {
    test("should allow add product", () => {
        const dto = VALID_PRODUCT;

        new AssortmentService(shopClient).addProduct(dto);

        expect(shopClient.addProduct).toHaveBeenCalledWith(dto);
    })
    test("should throw when required fields are not present", () => {
        const dto = INVALID_PRODUCT;

        expect(() => new AssortmentService(shopClient).addProduct(dto)).toThrow("Invalid Product")
    })
})

const VALID_PRODUCT = {
    name: "book",
    code: "some code",
    price: 123.45,
}

const INVALID_PRODUCT = {
    code: "some code",
    price: 123.45, 
}