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

    const invalidDtoTest = (dto, errorMessage) => {
        let shopClient = {
            addProduct: jest.fn()
        };

        const assortmentService = new AssortmentService(shopClient);

        expect(() => assortmentService.addProduct(dto)).toThrow(errorMessage);

    }


    test("should not allow to add product without code", () => {

        let dto = {
            name: "book",
            price: 123.45
        };

        invalidDtoTest(dto, 'Invalid product code')
    });

    test("should not allow to add product without name", () => {
        let dto = {
            code: "some code",
            price: 123.45
        };

        invalidDtoTest(dto, 'Invalid product name')
    });

    test("should not allow to add product without price", () => {
        let dto = {
            name: 'some name',
            code: "some code",
        };
        invalidDtoTest(dto, 'Invalid product price')
    });

    test("should not allow to add product with invalid code", () => {
        let dto = {
            name: 'some name',
            code: 555,
            price: 1
        };
        
        invalidDtoTest(dto, 'Invalid product code')
    });

    test("should not allow to add product with invalid name", () => {
        let dto = {
            name: 555,
            code: 'some code',
            price: 1
        };
        
        invalidDtoTest(dto, 'Invalid product name')
    });

    test("should not allow to add product with invalid description", () => {
        let dto = {
            name:"some name",
            describe: 555,
            code: 'some code',
            price: 1
        };
        
        invalidDtoTest(dto, 'Invalid product name')
    });



    test("should not allow to add product with invalid prize", () => {
        let dto = {
            name: 'some name',
            code: "some code",
            price: "1"
        };
        
        invalidDtoTest(dto, 'Invalid product price')
    });



    function givenValidProductDto() {
        return {
            name: "book",
            code: "some code",
            price: 123.45
        };
    }
})
