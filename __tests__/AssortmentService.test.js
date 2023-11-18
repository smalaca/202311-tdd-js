const AssortmentService = require("../src/AssortmentService");

describe("AssortmentService", () => {
    const VALID_NAME = "lecture";
    const VALID_CODE = "123456789-123456789-1234567890";
    const VALID_DESCRIPTION = "some description";
    const VALID_PRICE = 123.45;
    const VALID_AMOUNT = 13;

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
            let dto = {
                name: VALID_NAME,
                code: VALID_CODE,
                price: VALID_PRICE
            };
            let amount = 13;

            assortmentService.addProduct(dto, amount);

            expect(shopClient.addProduct).toHaveBeenCalledWith(dto, amount);
        });

        test("with description", () => {
            let dto = {
                name: VALID_NAME,
                code: VALID_CODE,
                price: VALID_PRICE,
                description: VALID_DESCRIPTION
            };
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

            let actual = () => assortmentService.addProduct(dto, VALID_AMOUNT);

            expect(actual).toThrowError("Missing product name");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        });

        test('when missing code', () => {
            let dto = {
                name: VALID_NAME,
                price: VALID_PRICE
            }

            let actual = () => assortmentService.addProduct(dto, VALID_AMOUNT);

            expect(actual).toThrowError("Missing product code");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        });

        test('when missing price', () => {
            let dto = {
                code: VALID_CODE,
                name: VALID_NAME
            }

            let actual = () => assortmentService.addProduct(dto, VALID_AMOUNT);

            expect(actual).toThrowError("Missing product price");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        });

        test('when additional attribute given', () => {
            let dto = {
                ...({
                    name: VALID_NAME,
                    code: VALID_CODE,
                    price: VALID_PRICE
                }), additional: "attribute"
            };

            let actual = () => assortmentService.addProduct(dto, VALID_AMOUNT);

            expect(actual).toThrowError("Attribute not expected");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        });

        test('when code contains 29 characters', () => {
            let dto = {
                code: "123456789-123456789-123456789",
                name: VALID_NAME,
                price: VALID_PRICE
            }

            let actual = () => assortmentService.addProduct(dto, VALID_AMOUNT);

            expect(actual).toThrowError("Invalid product code");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when code contains 31 characters', () => {
            let dto = {
                code: "123456789-1234567890-1234567890",
                name: VALID_NAME,
                price: VALID_PRICE
            }

            let actual = () => assortmentService.addProduct(dto, VALID_AMOUNT);

            expect(actual).toThrowError("Invalid product code");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when code contains letters', () => {
            let dto = {
                code: "123456789-123456789-1234567ABC",
                name: VALID_NAME,
                price: VALID_PRICE
            }

            let actual = () => assortmentService.addProduct(dto, VALID_AMOUNT);

            expect(actual).toThrowError("Invalid product code");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when code contains 4 characters', () => {
            let dto = {
                code: VALID_CODE,
                name: "abcd",
                price: VALID_PRICE
            }

            let actual = () => assortmentService.addProduct(dto, VALID_AMOUNT);

            expect(actual).toThrowError("Invalid product name");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when code contains 51 characters', () => {
            let dto = {
                code: VALID_CODE,
                name: "a".repeat(51),
                price: VALID_PRICE
            }

            let actual = () => assortmentService.addProduct(dto, VALID_AMOUNT);

            expect(actual).toThrowError("Invalid product name");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when price is zero', () => {
            let dto = {
                code: VALID_CODE,
                name: VALID_NAME,
                price: 0
            }

            let actual = () => assortmentService.addProduct(dto, VALID_AMOUNT);

            expect(actual).toThrowError("Invalid product price");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when amount is zero', () => {
            let dto = {
                code: VALID_CODE,
                name: VALID_NAME,
                price: VALID_PRICE
            }

            let actual = () => assortmentService.addProduct(dto, 0);

            expect(actual).toThrowError("Invalid product amount");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })
    });
})
