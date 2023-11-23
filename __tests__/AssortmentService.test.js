const AssortmentService = require("../src/AssortmentService");
const AddProductCommand = require("../src/AddProductCommand");
const ShopClient = require("../src/ShopClient");
const EventPublisher = require("../src/EventPublisher");
const ValidationError = require("../src/ValidationError");

class GivenAddProductCommand {
    NO_VALUE = undefined;
    assortmentId;
    amount;
    name;
    price;
    description;

    constructor(assortmentId, amount, name, price, description) {
        this.assortmentId = assortmentId;
        this.amount = amount;
        this.name = name;
        this.price = price;
        this.description = description;
    }

    withoutName() {
        return new AddProductCommand(this.assortmentId, this.amount, this.NO_VALUE, this.price, this.description);
    }

    withoutPrice() {
        return new AddProductCommand(this.assortmentId, this.amount, this.name, this.NO_VALUE, this.description);
    }
}

describe("AssortmentService", () => {
    const VALID_NAME = "1t15Pr0ductN4m3";
    const VALID_DESCRIPTION = "some description";
    const VALID_PRICE = 123.45;
    const VALID_AMOUNT = 13;
    const VALID_ASSORTMENT_ID = 984;
    const PRODUCT_ID = 42;
    const NO_VALUE = undefined;

    let shopClient;
    let eventPublisher;
    let assortmentService;
    let givenAddProductCommand = new GivenAddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_PRICE, VALID_DESCRIPTION);

    beforeEach(() => {
        let mockedShopClient = jest
            .spyOn(ShopClient.prototype, "addProduct")
            .mockImplementation(jest.fn());
        mockedShopClient.mockClear();

        let mockedEventPublisher = jest
            .spyOn(EventPublisher.prototype, "publish")
            .mockImplementation(jest.fn());
        mockedEventPublisher.mockClear();

        eventPublisher = new EventPublisher();
        shopClient = new ShopClient();
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

    const assertCodeIsValid = function(actual) {
        expect(actual.startsWith(VALID_NAME)).toBeTruthy();
        expect(actual.length).toEqual(30);
        expect(new Set(actual.substring(15).split("")).size).toBeGreaterThan(1);
        expect(actual.substring(15)).toMatch(/[a-zA-Z0-9]/);
    }

    describe("should add product", () => {
        test("without description", () => {
            givenProductAddedSuccessfully();
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_PRICE, NO_VALUE);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).toHaveBeenCalled();
            let actual = shopClient.addProduct.mock.calls[0][0];
            expect(actual.constructor.name).toBe("AddProductCommand");
            expect(actual.getAssortmentId()).toBe(VALID_ASSORTMENT_ID);
            expect(actual.getAmount()).toBe(VALID_AMOUNT);
            expect(actual.getName()).toBe(VALID_NAME);
            assertCodeIsValid(actual.getCode());
            expect(actual.getPrice()).toBe(VALID_PRICE);
            expect(actual.getDescription()).toBeUndefined();
        });

        function thenProductAdded() {
            expect(shopClient.addProduct).toHaveBeenCalled();
            let actual = shopClient.addProduct.mock.calls[0][0];
            expect(actual.constructor.name).toBe("AddProductCommand");
            return actual;
            // return new ProductAssertion(actual);
        }

        test("with description", () => {
            givenProductAddedSuccessfully();
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_PRICE, VALID_DESCRIPTION);
            // let command = givenAddProductCommand.withDescription();

            assortmentService.addProduct(command);

            // thenProductAdded()
            //     .hasAssortmentId(VALID_ASSORTMENT_ID)
            //     .hasAmount(VALID_AMOUNT)
            //     .hasName(VALID_NAME)
            //     .hasValidCode()
            //     .hasPrice(VALID_PRICE)
            //     .hasDescription(VALID_DESCRIPTION);
            let actual = thenProductAdded();
            expect(actual.constructor.name).toBe("AddProductCommand");
            expect(actual.getAssortmentId()).toBe(VALID_ASSORTMENT_ID);
            expect(actual.getAmount()).toBe(VALID_AMOUNT);
            expect(actual.getName()).toBe(VALID_NAME);
            assertCodeIsValid(actual.getCode());
            expect(actual.getPrice()).toBe(VALID_PRICE);
            expect(actual.getDescription()).toBe(VALID_DESCRIPTION);
        });
    });

    describe('should publish ProductAdded event when product successfully added', () => {
        test("when product has no description", () => {
            givenProductAddedSuccessfully();
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_PRICE, NO_VALUE);

            assortmentService.addProduct(command);

            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductAdded");
            expect(actual.getProductId()).toBe(PRODUCT_ID);
            expect(actual.getAssortmentId()).toBe(VALID_ASSORTMENT_ID);
            expect(actual.getAmount()).toBe(VALID_AMOUNT);
            expect(actual.getName()).toBe(VALID_NAME);
            assertCodeIsValid(actual.getCode());
            expect(actual.getPrice()).toBe(VALID_PRICE);
            expect(actual.getDescription()).toBeUndefined();
        })

        test("when product has description", () => {
            givenProductAddedSuccessfully();
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_PRICE, VALID_DESCRIPTION);

            assortmentService.addProduct(command);

            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductAdded");
            expect(actual.getProductId()).toBe(PRODUCT_ID);
            expect(actual.getAssortmentId()).toBe(VALID_ASSORTMENT_ID);
            expect(actual.getAmount()).toBe(VALID_AMOUNT);
            expect(actual.getName()).toBe(VALID_NAME);
            assertCodeIsValid(actual.getCode());
            expect(actual.getPrice()).toBe(VALID_PRICE);
            expect(actual.getDescription()).toBe(VALID_DESCRIPTION);
        })
    });

    describe('should not add product', () => {
        test('when missing name', () => {
            let command = givenAddProductCommand.withoutName();

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).not.toHaveBeenCalled();
            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
            expect(actual.getErrors()).toHaveLength(1);
            expect(actual.getErrors()).toContainEqual(new ValidationError("name", "Missing product name"));
        });

        test('when missing price', () => {
            let command = givenAddProductCommand.withoutPrice();

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).not.toHaveBeenCalled();
            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
            expect(actual.getErrors()).toHaveLength(1);
            expect(actual.getErrors()).toContainEqual(new ValidationError("price", "Missing product price"));
        });

        test('when name contains 4 characters', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, "abcd", VALID_PRICE, NO_VALUE);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).not.toHaveBeenCalled();
            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
            expect(actual.getErrors()).toHaveLength(1);
            expect(actual.getErrors()).toContainEqual(new ValidationError("name", "Invalid product name"));
        })

        test('when name contains 51 characters', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, "a".repeat(51), VALID_PRICE, NO_VALUE);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).not.toHaveBeenCalled();
            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
            expect(actual.getErrors()).toHaveLength(1);
            expect(actual.getErrors()).toContainEqual(new ValidationError("name", "Invalid product name"));
        })

        test('when price is zero', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, 0);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).not.toHaveBeenCalled();
            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
            expect(actual.getErrors()).toHaveLength(1);
            expect(actual.getErrors()).toContainEqual(new ValidationError("price", "Invalid product price"));
        })

        test('when amount is zero', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, 0, VALID_NAME, VALID_PRICE, NO_VALUE);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).not.toHaveBeenCalled();
            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
            expect(actual.getErrors()).toHaveLength(1);
            expect(actual.getErrors()).toContainEqual(new ValidationError("amount", "Invalid product amount"));
        })

        test('when amount is missing', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, NO_VALUE, VALID_NAME, VALID_PRICE, NO_VALUE);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).not.toHaveBeenCalled();
            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
            expect(actual.getErrors()).toHaveLength(1);
            expect(actual.getErrors()).toContainEqual(new ValidationError("amount", "Missing product amount"));
        })

        test('when assortment id is missing', () => {
            let command = new AddProductCommand(NO_VALUE, VALID_AMOUNT, VALID_NAME, VALID_PRICE, NO_VALUE);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).not.toHaveBeenCalled();
            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
            expect(actual.getErrors()).toHaveLength(1);
            expect(actual.getErrors()).toContainEqual(new ValidationError("assortmentId", "Missing assortment id"));
        })

        test('when all required values are missing', () => {
            let command = new AddProductCommand(NO_VALUE, NO_VALUE, NO_VALUE, NO_VALUE);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).not.toHaveBeenCalled();
            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
            expect(actual.getErrors()).toHaveLength(4);
            expect(actual.getErrors()).toContainEqual(new ValidationError("assortmentId", "Missing assortment id"));
            expect(actual.getErrors()).toContainEqual(new ValidationError("name", "Missing product name"));
            expect(actual.getErrors()).toContainEqual(new ValidationError("price", "Missing product price"));
            expect(actual.getErrors()).toContainEqual(new ValidationError("amount", "Missing product amount"));
        })

        test('when all values are invalid', () => {
            let command = new AddProductCommand(NO_VALUE, 0, "aaaa", 0);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).not.toHaveBeenCalled();
            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
            expect(actual.getErrors()).toHaveLength(4);
            expect(actual.getErrors()).toContainEqual(new ValidationError("assortmentId", "Missing assortment id"));
            expect(actual.getErrors()).toContainEqual(new ValidationError("name", "Invalid product name"));
            expect(actual.getErrors()).toContainEqual(new ValidationError("price", "Invalid product price"));
            expect(actual.getErrors()).toContainEqual(new ValidationError("amount", "Invalid product amount"));
        })
    });

    test('should publish ProductCouldNotBeAdded event when product could not be added', () => {
        shopClient.addProduct.mockImplementation(() => {
            return {
                success: false,
                errors: [
                    new ValidationError("name", "something wrong with the name"),
                    new ValidationError("amount", "I cannot handle such amount of products")
                ]
            }
        })
        let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_PRICE, NO_VALUE);

        assortmentService.addProduct(command);

        expect(eventPublisher.publish).toHaveBeenCalled();
        let actual = eventPublisher.publish.mock.calls[0][0];
        expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
        expect(actual.getErrors()).toHaveLength(2);
        expect(actual.getErrors()).toContainEqual(new ValidationError("name", "something wrong with the name"));
        expect(actual.getErrors()).toContainEqual(new ValidationError("amount", "I cannot handle such amount of products"));
    })
})
