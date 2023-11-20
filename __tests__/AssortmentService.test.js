const AssortmentService = require("../src/AssortmentService");
const ProductAdded = require("../src/ProductAdded");

describe("AssortmentService", () => {
    const VALID_NAME = "lecture";
    const VALID_CODE = "123456789-123456789-1234567890";
    const VALID_DESCRIPTION = "some description";
    const VALID_PRICE = 123.45;
    const VALID_AMOUNT = 13;
    const PRODUCT_ID = 42;
    const VALID_ASSORTMENT_ID = 1;

    let shopClient;
    let eventPublisher;
    let assortmentService;

    beforeEach(() => {
        shopClient = {
            addProduct: jest.fn()
        };

        eventPublisher = {
            publish: jest.fn()
        }

        assortmentService = new AssortmentService(shopClient, eventPublisher);
    });

    const givenProductAddedSuccessfully = function () {
        shopClient.addProduct.mockImplementation(() => {
            return {
                success: true,
                productId: PRODUCT_ID
            }
        });
    };

    describe("should add product", () => {
        test("without description", () => {
            givenProductAddedSuccessfully();
            let dto = {
                name: VALID_NAME,
                code: VALID_CODE,
                price: VALID_PRICE
            };

            assortmentService.addProduct(dto, VALID_AMOUNT, VALID_ASSORTMENT_ID);

            expect(shopClient.addProduct).toHaveBeenCalledWith({
                ...dto,
                amount: VALID_AMOUNT,
                assortmentId: VALID_ASSORTMENT_ID
            });
        });

        test("with description", () => {
            givenProductAddedSuccessfully();
            let dto = {
                name: VALID_NAME,
                code: VALID_CODE,
                price: VALID_PRICE,
                description: VALID_DESCRIPTION
            };

            assortmentService.addProduct(dto, VALID_AMOUNT, VALID_ASSORTMENT_ID);

            expect(shopClient.addProduct).toHaveBeenCalledWith({
                ...dto,
                amount: VALID_AMOUNT,
                assortmentId: VALID_ASSORTMENT_ID
            });
        });
    });

    describe('should publish ProductAdded event when product successfully added', () => {
        test("when product has no description", () => {
            givenProductAddedSuccessfully();
            let dto = {
                name: VALID_NAME,
                code: VALID_CODE,
                price: VALID_PRICE
            };

            assortmentService.addProduct(dto, VALID_AMOUNT, VALID_ASSORTMENT_ID);

            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductAdded");
            expect(actual.getProductId()).toBe(PRODUCT_ID);
            expect(actual.getAmount()).toBe(VALID_AMOUNT);
            expect(actual.getName()).toBe(VALID_NAME);
            expect(actual.getCode()).toBe(VALID_CODE);
            expect(actual.getPrice()).toBe(VALID_PRICE);
            expect(actual.getDescription()).toBeUndefined();
        })

        test("when product has description", () => {
            givenProductAddedSuccessfully();
            let dto = {
                name: VALID_NAME,
                code: VALID_CODE,
                price: VALID_PRICE,
                description: VALID_DESCRIPTION
            };

            assortmentService.addProduct(dto, VALID_AMOUNT, VALID_ASSORTMENT_ID);

            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductAdded");
            expect(actual.getProductId()).toBe(PRODUCT_ID);
            expect(actual.getAmount()).toBe(VALID_AMOUNT);
            expect(actual.getName()).toBe(VALID_NAME);
            expect(actual.getCode()).toBe(VALID_CODE);
            expect(actual.getPrice()).toBe(VALID_PRICE);
            expect(actual.getDescription()).toBe(VALID_DESCRIPTION);
        })
    });

    describe('should not add product', () => {
        test('when missing name', () => {
            let dto = {
                code: VALID_CODE,
                price: VALID_PRICE
            }

            let actual = assortmentService.addProduct(dto, VALID_AMOUNT, VALID_ASSORTMENT_ID);

            expect(actual).toEqual({
                success: false,
                errors: [{
                    fieldName: "name",
                    description: "Missing product name"
                }]
            });
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        });

        test('when missing code', () => {
            let dto = {
                name: VALID_NAME,
                price: VALID_PRICE
            }

            let actual = assortmentService.addProduct(dto, VALID_AMOUNT, VALID_ASSORTMENT_ID);

            expect(actual).toEqual({
                success: false,
                errors: [{
                    fieldName: "code",
                    description: "Missing product code"
                }]
            });
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        });

        test('when missing price', () => {
            let dto = {
                code: VALID_CODE,
                name: VALID_NAME
            }

            let actual = assortmentService.addProduct(dto, VALID_AMOUNT, VALID_ASSORTMENT_ID);

            expect(actual).toEqual({
                success: false,
                errors: [{
                    fieldName: "price",
                    description: "Missing product price"
                }]
            });
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

            let actual = assortmentService.addProduct(dto, VALID_AMOUNT, VALID_ASSORTMENT_ID);

            expect(actual).toEqual({
                success: false,
                description: "Attribute not expected"
            });
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        });

        test('when code contains 29 characters', () => {
            let dto = {
                code: "123456789-123456789-123456789",
                name: VALID_NAME,
                price: VALID_PRICE
            }

            let actual = assortmentService.addProduct(dto, VALID_AMOUNT, VALID_ASSORTMENT_ID);

            expect(actual).toEqual({
                success: false,
                errors: [{
                    fieldName: "code",
                    description: "Invalid product code"
                }]
            });
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when code contains 31 characters', () => {
            let dto = {
                code: "123456789-1234567890-1234567890",
                name: VALID_NAME,
                price: VALID_PRICE
            }

            let actual = assortmentService.addProduct(dto, VALID_AMOUNT, VALID_ASSORTMENT_ID);

            expect(actual).toEqual({
                success: false,
                errors: [{
                    fieldName: "code",
                    description: "Invalid product code"
                }]
            });
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when code contains letters', () => {
            let dto = {
                code: "123456789-123456789-1234567ABC",
                name: VALID_NAME,
                price: VALID_PRICE
            }

            let actual = assortmentService.addProduct(dto, VALID_AMOUNT, VALID_ASSORTMENT_ID);

            expect(actual).toEqual({
                success: false,
                errors: [{
                    fieldName: "code",
                    description: "Invalid product code"
                }]
            });
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when name contains 4 characters', () => {
            let dto = {
                code: VALID_CODE,
                name: "abcd",
                price: VALID_PRICE
            }

            let actual = assortmentService.addProduct(dto, VALID_AMOUNT, VALID_ASSORTMENT_ID);

            expect(actual).toEqual({
                success: false,
                errors: [{
                    fieldName: "name",
                    description: "Invalid product name"
                }]
            });
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when name contains 51 characters', () => {
            let dto = {
                code: VALID_CODE,
                name: "a".repeat(51),
                price: VALID_PRICE
            }

            let actual = assortmentService.addProduct(dto, VALID_AMOUNT, VALID_ASSORTMENT_ID);

            expect(actual).toEqual({
                success: false,
                errors: [{
                    fieldName: "name",
                    description: "Invalid product name"
                }]
            });
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when price is zero', () => {
            let dto = {
                code: VALID_CODE,
                name: VALID_NAME,
                price: 0
            }

            let actual = assortmentService.addProduct(dto, VALID_AMOUNT, VALID_ASSORTMENT_ID);

            expect(actual).toEqual({
                success: false,
                errors: [{
                    fieldName: "price",
                    description: "Invalid product price"
                }]
            });
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when amount is zero', () => {
            let dto = {
                code: VALID_CODE,
                name: VALID_NAME,
                price: VALID_PRICE
            }

            let actual = assortmentService.addProduct(dto, 0, VALID_ASSORTMENT_ID);

            expect(actual).toEqual({
                success: false,
                errors: [{
                    fieldName: "amount",
                    description: "Invalid product amount"
                }]
            });
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when amount is not defined', () => {
            let dto = {
                code: VALID_CODE,
                name: VALID_NAME,
                price: VALID_PRICE
            }
            let actual = assortmentService.addProduct(dto, undefined, VALID_ASSORTMENT_ID);

            expect(actual).toEqual({
                success: false,
                errors: [{
                    fieldName: "amount",
                    description: "Missing product amount"
                }]
            });
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when multiple fields are invalid', () => {
            let dto = {
                code: "123",
                price: VALID_PRICE
            }
            let actual = assortmentService.addProduct(dto, undefined, VALID_ASSORTMENT_ID);

            expect(actual).toEqual({
                success: false,
                errors: [
                {
                    fieldName: "name",
                    description: "Missing product name"
                },
                {
                    fieldName: "amount",
                    description: "Missing product amount"
                },
                {
                    fieldName: "code",
                    description: "Invalid product code"
                },
            ]
            });
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })
    });

    test('should publish ProductCouldNotBeAdded event when product could not be added', () => {
        shopClient.addProduct.mockImplementation(() => {
            return {
                success: false,
                errors: [{
                    fieldName: "name",
                    description: "something wrong with the name"
                }, {
                    fieldName: "amount",
                    description: "I cannot handle such amount of products"
                }]
            }
        })
        let dto = {
            name: VALID_NAME,
            code: VALID_CODE,
            price: VALID_PRICE
        };

        assortmentService.addProduct(dto, VALID_AMOUNT, VALID_ASSORTMENT_ID);

        expect(eventPublisher.publish).toHaveBeenCalled();
        let actual = eventPublisher.publish.mock.calls[0][0];
        expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
        expect(actual.getErrors()).toHaveLength(2);
        expect(actual.getErrors()).toContainEqual({
            fieldName: "name",
            description: "something wrong with the name"
        });
        expect(actual.getErrors()).toContainEqual({
            fieldName: "amount",
            description: "I cannot handle such amount of products"
        });
    })
})
