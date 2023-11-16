const AssortmentService = require('../src/Assortment.service');
const shopClient = {
    addProduct: jest.fn()
};
const INVALID = require('../src/Errors')

describe("AssortmentService", () => {
    test("should allow add product", () => {
        const dto = VALID_PRODUCT;

        new AssortmentService(shopClient).addProduct(dto);

        expect(shopClient.addProduct).toHaveBeenCalledWith(dto);
    })
    test("should throw when required fields are not present", () => {
        const dto = INVALID_PRODUCT;

        expect(() => new AssortmentService(shopClient).addProduct(dto)).toThrow(INVALID.PRODUCT)
    })
    test("should throw when required fields are not in the right type", () => {
        const dto = INVALID_TYPE

        expect(() => new AssortmentService(shopClient).addProduct(dto)).toThrow(INVALID.TYPE) 
    })
})

const VALID_PRODUCT = {
    name: "book",
    code: "some code",
    price: 123.45,
    description: "some desc"
}

const INVALID_PRODUCT = {
    code: "some code",
    price: 123.45,
}

const INVALID_TYPE = {
    name: "book",
    code: "some code",
    price: "123.45",
}