const AssortmentService = require("../src/AssortmentService");
const AddProductCommand = require("../src/AddProductCommand");
const ShopClient = require("../src/ShopClient");
const CategoriesRepository = require("../src/CategoriesRepository");
const EventPublisher = require("../src/EventPublisher");
const ValidationError = require("../src/ValidationError");

describe("AssortmentService", () => {
    const VALID_NAME = "1t15Pr0ductN4m3";
    const VALID_DESCRIPTION = "some description";
    const VALID_PRICE = 123.45;
    const VALID_AMOUNT = 13;
    const VALID_ASSORTMENT_ID = 984;
    const PRODUCT_ID = 42;
    const NO_VALUE = undefined;
    const VALID_CATEGORIES = ['electronics'];
    const EMPTY_ARRAY = [];

    let shopClient;
    let categoriesRepository;
    let eventPublisher;
    let assortmentService;

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
        categoriesRepository = new CategoriesRepository();
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
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_PRICE, VALID_CATEGORIES, NO_VALUE);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).toHaveBeenCalled();
            let actual = shopClient.addProduct.mock.calls[0][0];
            expect(categoriesRepository.getValidCategories).toHaveBeenCalled();
            expect(actual.constructor.name).toBe("AddProductCommand");
            expect(actual.getAssortmentId()).toBe(VALID_ASSORTMENT_ID);
            expect(actual.getAmount()).toBe(VALID_AMOUNT);
            expect(actual.getName()).toBe(VALID_NAME);
            assertCodeIsValid(actual.getCode());
            expect(actual.getPrice()).toBe(VALID_PRICE);
            expect(actual.getDescription()).toBeUndefined();
        });

        test("with description", () => {
            givenProductAddedSuccessfully();
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_PRICE, VALID_CATEGORIES, VALID_DESCRIPTION);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).toHaveBeenCalled();
            let actual = shopClient.addProduct.mock.calls[0][0];
            expect(actual.constructor.name).toBe("AddProductCommand");
            expect(actual.getAssortmentId()).toBe(VALID_ASSORTMENT_ID);
            expect(actual.getAmount()).toBe(VALID_AMOUNT);
            expect(actual.getName()).toBe(VALID_NAME);
            assertCodeIsValid(actual.getCode());
            expect(actual.getPrice()).toBe(VALID_PRICE);
            expect(actual.getDescription()).toBe(VALID_DESCRIPTION);
            expect(actual.getCategories()).toBe(VALID_CATEGORIES);
        });
    });

    describe('should publish ProductAdded event when product successfully added', () => {
        test("when product has no description", () => {
            givenProductAddedSuccessfully();
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_PRICE, VALID_CATEGORIES, NO_VALUE);

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
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_PRICE, VALID_CATEGORIES, VALID_DESCRIPTION);

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
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, NO_VALUE, VALID_PRICE, VALID_CATEGORIES, NO_VALUE);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).not.toHaveBeenCalled();
            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
            expect(actual.getErrors()).toHaveLength(1);
            expect(actual.getErrors()).toContainEqual(new ValidationError("name", "Missing product name"));
        });

        test('when missing price', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, NO_VALUE, VALID_CATEGORIES, NO_VALUE);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).not.toHaveBeenCalled();
            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
            expect(actual.getErrors()).toHaveLength(1);
            expect(actual.getErrors()).toContainEqual(new ValidationError("price", "Missing product price"));
        });

        test('when name contains 4 characters', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, "abcd", VALID_PRICE, VALID_CATEGORIES, NO_VALUE);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).not.toHaveBeenCalled();
            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
            expect(actual.getErrors()).toHaveLength(1);
            expect(actual.getErrors()).toContainEqual(new ValidationError("name", "Invalid product name"));
        })

        test('when name contains 51 characters', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, "a".repeat(51), VALID_PRICE, VALID_CATEGORIES, NO_VALUE);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).not.toHaveBeenCalled();
            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
            expect(actual.getErrors()).toHaveLength(1);
            expect(actual.getErrors()).toContainEqual(new ValidationError("name", "Invalid product name"));
        })

        test('when price is zero', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, 0, VALID_CATEGORIES);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).not.toHaveBeenCalled();
            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
            expect(actual.getErrors()).toHaveLength(1);
            expect(actual.getErrors()).toContainEqual(new ValidationError("price", "Invalid product price"));
        })

        test('when amount is zero', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, 0, VALID_NAME, VALID_PRICE, VALID_CATEGORIES, NO_VALUE);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).not.toHaveBeenCalled();
            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
            expect(actual.getErrors()).toHaveLength(1);
            expect(actual.getErrors()).toContainEqual(new ValidationError("amount", "Invalid product amount"));
        })

        test('when amount is missing', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, NO_VALUE, VALID_NAME, VALID_PRICE, VALID_CATEGORIES, NO_VALUE);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).not.toHaveBeenCalled();
            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
            expect(actual.getErrors()).toHaveLength(1);
            expect(actual.getErrors()).toContainEqual(new ValidationError("amount", "Missing product amount"));
        })

        test('when assortment id is missing', () => {
            let command = new AddProductCommand(NO_VALUE, VALID_AMOUNT, VALID_NAME, VALID_PRICE, VALID_CATEGORIES, NO_VALUE);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).not.toHaveBeenCalled();
            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
            expect(actual.getErrors()).toHaveLength(1);
            expect(actual.getErrors()).toContainEqual(new ValidationError("assortmentId", "Missing assortment id"));
        })

        test('when category array is empty', () => {
            let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_PRICE, EMPTY_ARRAY, NO_VALUE);

            assortmentService.addProduct(command);

            expect(shopClient.addProduct).not.toHaveBeenCalled();
            expect(eventPublisher.publish).toHaveBeenCalled();
            let actual = eventPublisher.publish.mock.calls[0][0];
            expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
            expect(actual.getErrors()).toHaveLength(1);
            expect(actual.getErrors()).toContainEqual(new ValidationError("categories", "Categories are empty"));
        })

        test('when all required values are missing', () => {
            let command = new AddProductCommand(NO_VALUE, NO_VALUE, NO_VALUE, NO_VALUE, VALID_CATEGORIES);

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
            let command = new AddProductCommand(NO_VALUE, 0, "aaaa", 0, VALID_CATEGORIES);

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
        let command = new AddProductCommand(VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_PRICE, VALID_CATEGORIES, NO_VALUE);

        assortmentService.addProduct(command);

        expect(eventPublisher.publish).toHaveBeenCalled();
        let actual = eventPublisher.publish.mock.calls[0][0];
        expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
        expect(actual.getErrors()).toHaveLength(2);
        expect(actual.getErrors()).toContainEqual(new ValidationError("name", "something wrong with the name"));
        expect(actual.getErrors()).toContainEqual(new ValidationError("amount", "I cannot handle such amount of products"));
    })
})
