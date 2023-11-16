const AssortmentService = require("../src/AssortmentService");

describe("AssortmentService", () => {
    const VALID_NAME = "book";
    const VALID_CODE = "some code";
    const VALID_PRICE = 123.45;
    const DUMMY_AMOUNT = undefined;

    const SHOP_CLIENT = {
        addProduct: jest.fn()
    };

    const UI_CLIENT = {
        closeForm: jest.fn(),
        showSuccessMessage: jest.fn(),
        setPendingProductsCount: jest.fn()
    };

    const ASSORTMENT_SERVICE = new AssortmentService(SHOP_CLIENT, UI_CLIENT);


    describe('happy path', () => {
        test("should allow add product", () => {
            let dto = givenValidProductDto();
            let amount = 13;
    
            ASSORTMENT_SERVICE.addProduct(dto, amount);
    
            expect(SHOP_CLIENT.addProduct).toHaveBeenCalledWith(dto, amount);
        });

        test("should close the form", () => {
            let dto = givenValidProductDto();
            let amount = 13;
    
            ASSORTMENT_SERVICE.addProduct(dto, amount);
    
            expect(UI_CLIENT.closeForm).toHaveBeenCalled();
        });

        test("should show success message", () => {
            let dto = givenValidProductDto();
            let amount = 13;
    
            ASSORTMENT_SERVICE.addProduct(dto, amount);
    
            expect(UI_CLIENT.showSuccessMessage)
                .toHaveBeenCalledWith("Product added successfully");
        });

        test("should update number of products under verification from 4 to 5", () => {
            let dto = givenValidProductDto();
            let amount = 13;
            const pendingProductsCount = 4;
    
            ASSORTMENT_SERVICE.addProduct(dto, amount);
    
            expect(UI_CLIENT.setPendingProductsCount)
                .toHaveBeenCalledWith(5);
        });

        test("should update number of products under verification from 0 to 1", () => {
            let dto = givenValidProductDto();
            let amount = 13;
            const pendingProductsCount = 0;
    
            ASSORTMENT_SERVICE.addProduct(dto, amount);
    
            expect(UI_CLIENT.setPendingProductsCount)
                .toHaveBeenCalledWith(1);
        });
    });

    describe('should fail', () => {
        test('when missing name', () => {
            let dto = {
                code: VALID_CODE,
                price: VALID_PRICE
            }

            let actual = () => ASSORTMENT_SERVICE.addProduct(dto, DUMMY_AMOUNT);

            expect(actual).toThrowError("Missing product name");
        });

        test('when missing code', () => {
            let dto = {
                name: VALID_NAME,
                price: VALID_PRICE
            }

            let actual = () => ASSORTMENT_SERVICE.addProduct(dto, DUMMY_AMOUNT);

            expect(actual).toThrowError("Missing product code");
        });

        test('when missing price', () => {
            let dto = {
                code: VALID_CODE,
                name: VALID_NAME
            }

            let actual = () => ASSORTMENT_SERVICE.addProduct(dto, DUMMY_AMOUNT);

            expect(actual).toThrowError("Missing product price");
        });

        test('when additional attribute given', () => {
            // TO BE DONE
        });
    });

    function givenValidProductDto() {
        return {
            name: VALID_NAME,
            code: VALID_CODE,
            price: VALID_PRICE
        };
    }
})
