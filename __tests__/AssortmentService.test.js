const AssortmentService = require("./AssortmentService");

describe("AssortmentService", () => {
    const VALID_NAME = "book";
    const VALID_CODE = "some code";
    const VALID_PRICE = 123.45;

    const SHOP_CLIENT = {
        addProduct: jest.fn()
    };
    const ASSORTMENT_SERVICE = new AssortmentService(SHOP_CLIENT);

    test("should allow add product", () => {
        let dto = givenValidProductDto();

        ASSORTMENT_SERVICE.addProduct(dto);

        expect(SHOP_CLIENT.addProduct).toHaveBeenCalledWith(dto);
    });

    describe('should fail', () => {
        test('when missing name', () => {
            let dto = {
                code: VALID_CODE,
                price: VALID_PRICE
            }

            let actual = () => ASSORTMENT_SERVICE.addProduct(dto);

            expect(actual).toThrowError("Missing product name");
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
