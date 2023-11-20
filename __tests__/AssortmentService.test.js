const AssortmentService = require("../src/AssortmentService");
const AddProductCommand = require("../src/AddProductCommand");

describe("AssortmentService", () => {
    const VALID_NAME = "lecture";
    const VALID_CODE = "123456789-123456789-1234567890";
    const VALID_DESCRIPTION = "some description";
    const VALID_PRICE = 123.45;
    const VALID_AMOUNT = 13;
    const VALID_ASSORTMENT_ID = 984;
    const PRODUCT_ID = 42;
    const NO_VALUE = undefined;

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
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_CODE, VALID_PRICE, NO_VALUE);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).toHaveBeenCalled();
            let actual = shopClient.addProduct.mock.calls[0][0];
            expect(actual.constructor.name).toBe("AddProductCommand");
            expect(actual.getAssortmentId()).toBe(VALID_ASSORTMENT_ID);
            expect(actual.getAmount()).toBe(VALID_AMOUNT);
            expect(actual.getName()).toBe(VALID_NAME);
            expect(actual.getCode()).toBe(VALID_CODE);
            expect(actual.getPrice()).toBe(VALID_PRICE);
            expect(actual.getDescription()).toBeUndefined();
        });

        test("with description", () => {
            givenProductAddedSuccessfully();
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_CODE, VALID_PRICE, VALID_DESCRIPTION);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).toHaveBeenCalled();
            let actual = shopClient.addProduct.mock.calls[0][0];
            expect(actual.constructor.name).toBe("AddProductCommand");
            expect(actual.getAssortmentId()).toBe(VALID_ASSORTMENT_ID);
            expect(actual.getAmount()).toBe(VALID_AMOUNT);
            expect(actual.getName()).toBe(VALID_NAME);
            expect(actual.getCode()).toBe(VALID_CODE);
            expect(actual.getPrice()).toBe(VALID_PRICE);
            expect(actual.getDescription()).toBe(VALID_DESCRIPTION);
        });
    });

    describe('should publish ProductAdded event when product successfully added', () => {
        test("when product has no description", () => {
            givenProductAddedSuccessfully();
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_CODE, VALID_PRICE, NO_VALUE);

            assortmentService.addProduct(command);

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
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_CODE, VALID_PRICE, VALID_DESCRIPTION);

            assortmentService.addProduct(command);

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
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, NO_VALUE, VALID_CODE, VALID_PRICE, NO_VALUE);

            let actual = () => assortmentService.addProduct(command);

            expect(actual).toThrowError("Missing product name");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        });

        test('when missing code', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, NO_VALUE, VALID_PRICE, NO_VALUE);

            let actual = () => assortmentService.addProduct(command);

            expect(actual).toThrowError("Missing product code");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        });

        test('when missing price', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_CODE, NO_VALUE);

            let actual = () => assortmentService.addProduct(command);

            expect(actual).toThrowError("Missing product price");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        });

        test('when code contains 29 characters', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, "123456789-123456789-123456789", VALID_PRICE, NO_VALUE);

            let actual = () => assortmentService.addProduct(command);

            expect(actual).toThrowError("Invalid product code");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when code contains 31 characters', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, "123456789-1234567890-1234567890", VALID_PRICE, NO_VALUE);

            let actual = () => assortmentService.addProduct(command);

            expect(actual).toThrowError("Invalid product code");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when code contains letters', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, "123456789-123456789-1234567ABC", VALID_PRICE, NO_VALUE);

            let actual = () => assortmentService.addProduct(command);

            expect(actual).toThrowError("Invalid product code");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when name contains 4 characters', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, "abcd", VALID_CODE, VALID_PRICE, NO_VALUE);

            let actual = () => assortmentService.addProduct(command);

            expect(actual).toThrowError("Invalid product name");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when name contains 51 characters', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, "a".repeat(51), VALID_CODE, VALID_PRICE, NO_VALUE);

            let actual = () => assortmentService.addProduct(command);

            expect(actual).toThrowError("Invalid product name");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when price is zero', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_CODE, 0);

            let actual = () => assortmentService.addProduct(command);

            expect(actual).toThrowError("Invalid product price");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when amount is zero', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, 0, VALID_NAME, VALID_CODE, VALID_PRICE, NO_VALUE);

            let actual = () => assortmentService.addProduct(command);

            expect(actual).toThrowError("Invalid product amount");
            expect(shopClient.addProduct).not.toHaveBeenCalled();
        })

        test('when amount is not defined', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, NO_VALUE, VALID_NAME, VALID_CODE, VALID_PRICE, NO_VALUE);

            let actual = () => assortmentService.addProduct(command);

            expect(actual).toThrowError("Missing product amount");
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
        let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_CODE, VALID_PRICE, NO_VALUE);

        assortmentService.addProduct(command);

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
