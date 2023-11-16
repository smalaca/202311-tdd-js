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
    test("should throw error if code is not 30 chars", () => {
        const dto = {
            name: "book",
            code: "asdf",
            price: 123.45
        }

        expect(() => new AssortmentService(shopClient).addProduct(dto)).toThrow(INVALID.CODE) 
    })
})


// W przypadku gdy uda się dodać produkt do asortymentu:
// - zamknij formularz dodawania
// - wyświetl informację o dodaniu produktu w odpowiednim komponencie
// - zaktualizuj ilość produktów weryfikowanych
// - zaktualizuj komponent wyświetlający listę produktów i dodaj nowy produkt

const VALID_PRODUCT = {
    name: "book",
    code: "012345678901234567890123456789",
    price: 123.45,
    description: "some desc"
}

const INVALID_PRODUCT = {
    code: "012345678901234567890123456789",
    price: 123.45,
}

const INVALID_TYPE = {
    name: "book",
    code: "012345678901234567890123456789",
    price: "123.45",
}