const AssortmentService = require("./AssortmentService");

describe("AssortmentService", () => {
    const VALID_NAME = "book";
    const VALID_CODE = "some code";
    const VALID_DESCRIPTION = "some description";
    const VALID_PRICE = 123.45;
    const DUMMY_AMOUNT = undefined;

    let shopClient;
    let assortmentService;

    beforeEach(() => {
        shopClient = {
            addProduct: jest.fn()
        };

        assortmentService = new AssortmentService(shopClient);
    });

    describe("should add product", () => {
        test("without description", () => {
            let dto = givenValidProductDto();
            let amount = 13;

            assortmentService.addProduct(dto, amount);

            expect(shopClient.addProduct).toHaveBeenCalledWith(dto, amount);
        });

        test("with description", () => {
            let dto = {...givenValidProductDto(), description: VALID_DESCRIPTION};
            let amount = 13;

            assortmentService.addProduct(dto, amount);

            expect(shopClient.addProduct).toHaveBeenCalledWith(dto, amount);
        });
    });

    describe('should not add product', () => {
        test('when missing name', () => {
            let dto = {
                code: VALID_CODE,
                price: VALID_PRICE
            }

            let actual = () => assortmentService.addProduct(dto, DUMMY_AMOUNT);

            expect(actual).toThrowError("Missing product name");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        });

        test('when missing code', () => {
            let dto = {
                name: VALID_NAME,
                price: VALID_PRICE
            }

            let actual = () => assortmentService.addProduct(dto, DUMMY_AMOUNT);

            expect(actual).toThrowError("Missing product code");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        });

        test('when missing price', () => {
            let dto = {
                code: VALID_CODE,
                name: VALID_NAME
            }

            let actual = () => assortmentService.addProduct(dto, DUMMY_AMOUNT);

            expect(actual).toThrowError("Missing product price");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        });

        test('when additional attribute given', () => {
            let dto = {...givenValidProductDto(), additional: "attribute"};

            let actual = () => assortmentService.addProduct(dto, DUMMY_AMOUNT);

            expect(actual).toThrowError("Attribute not expected");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
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
