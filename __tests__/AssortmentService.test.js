const AssortmentService = require("../src/AssortmentService");
const AddProductCommand = require("../src/AddProductCommand");
const ShopClient = require("../src/ShopClient");
const EventPublisher = require("../src/EventPublisher");
const ValidationError = require("../src/ValidationError");

const GivenAddProductCommand = require("./GivenAddProductCommand");
const AddProductCommandAssertion = require("./AddProductCommandAssertion");
const ProductAddedAssertion = require("./ProductAddedAssertion");
const ProductCouldNotBeAddedAssertion = require("./ProductCouldNotBeAddedAssertion");
const ShopClientContract = require("./ShopClientContract");

describe("AssortmentService", () => {
    const VALID_NAME = "1t15Pr0ductN4m3";
    const VALID_DESCRIPTION = "some description";
    const VALID_PRICE = 123.45;
    const VALID_AMOUNT = 13;
    const VALID_ASSORTMENT_ID = 984;
    const PRODUCT_ID = 42;
    const VALID_CATEGORY = ["book"]
    const NO_VALUE = undefined;

    let shopClient;
    let eventPublisher;
    let assortmentService;
    let givenAddProductCommand = new GivenAddProductCommand(
        VALID_ASSORTMENT_ID, VALID_AMOUNT, VALID_NAME, VALID_PRICE, VALID_CATEGORY, VALID_DESCRIPTION);

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
    }

    const givenValidationErrorsWhenAddingProduct = function () {
        shopClient.addProduct.mockImplementation(() => {
            return {
                success: false,
                errors: [
                    new ValidationError("name", "something wrong with the name"),
                    new ValidationError("amount", "I cannot handle such amount of products")
                ]
            }
        })
    }

    const thenProductAdded = function () {
        expect(shopClient.addProduct).toHaveBeenCalled();
        let actual = shopClient.addProduct.mock.calls[0][0];
        return new AddProductCommandAssertion(actual);
    }

    const thenProductNotAdded = function () {
        expect(shopClient.addProduct).not.toHaveBeenCalled();
    }

    const thenProductAddedEventPublished = function () {
        expect(eventPublisher.publish).toHaveBeenCalled();
        let actual = eventPublisher.publish.mock.calls[0][0];
        return new ProductAddedAssertion(actual);
    }

    const thenProductCouldNotBeAddedEventPublished = function () {
        expect(eventPublisher.publish).toHaveBeenCalled();
        let actual = eventPublisher.publish.mock.calls[0][0];
        expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");

        return new ProductCouldNotBeAddedAssertion(actual);
    }

    test("should add product using shop client contract", () => {
        let scenario = new ShopClientContract().successfullyAddProductWithoutDescription();
        shopClient.addProduct.mockImplementation(() => {
            return scenario.getResponse()
        });
        let command = givenAddProductCommand.withoutDescription();

        assortmentService.addProduct(command);

        thenProductAdded()
            .hasAssortmentId(VALID_ASSORTMENT_ID)
            .hasAmount(VALID_AMOUNT)
            .hasName(VALID_NAME)
            .hasValidCodeFrom(VALID_NAME)
            .hasPrice(VALID_PRICE)
            .hasNoDescription();
    });

    describe("should add product", () => {
        test("without description", () => {
            givenProductAddedSuccessfully();
            let command = givenAddProductCommand.withoutDescription();

            assortmentService.addProduct(command);

            thenProductAdded()
                .hasAssortmentId(VALID_ASSORTMENT_ID)
                .hasAmount(VALID_AMOUNT)
                .hasName(VALID_NAME)
                .hasValidCodeFrom(VALID_NAME)
                .hasPrice(VALID_PRICE)
                .hasNoDescription();
        });

        test("with description", () => {
            givenProductAddedSuccessfully();
            let command = givenAddProductCommand.withDescription();

            assortmentService.addProduct(command);

            thenProductAdded()
                .hasAssortmentId(VALID_ASSORTMENT_ID)
                .hasAmount(VALID_AMOUNT)
                .hasName(VALID_NAME)
                .hasValidCodeFrom(VALID_NAME)
                .hasPrice(VALID_PRICE)
                .hasDescription(VALID_DESCRIPTION);
        });
    });

    describe('should publish ProductAdded event when product successfully added', () => {
        test("when product has no description", () => {
            givenProductAddedSuccessfully();
            let command = givenAddProductCommand.withoutDescription();

            assortmentService.addProduct(command);

            thenProductAddedEventPublished()
                .hasProductId(PRODUCT_ID)
                .hasAssortmentId(VALID_ASSORTMENT_ID)
                .hasAmount(VALID_AMOUNT)
                .hasName(VALID_NAME)
                .hasValidCodeFrom(VALID_NAME)
                .hasPrice(VALID_PRICE)
                .hasNoDescription();
        })

        test("when product has description", () => {
            givenProductAddedSuccessfully();
            let command = givenAddProductCommand.withDescription();

            assortmentService.addProduct(command);

            thenProductAddedEventPublished()
                .hasProductId(PRODUCT_ID)
                .hasAssortmentId(VALID_ASSORTMENT_ID)
                .hasAmount(VALID_AMOUNT)
                .hasName(VALID_NAME)
                .hasValidCodeFrom(VALID_NAME)
                .hasPrice(VALID_PRICE)
                .hasDescription(VALID_DESCRIPTION);
        })
    });

    describe('should not add product', () => {
        let parameters = [
            [givenAddProductCommand.withoutName(), "name", "Missing product name"],
            [givenAddProductCommand.withoutPrice(), "price", "Missing product price"],
            [givenAddProductCommand.withName( "abcd"), "name", "Invalid product name"],
            [givenAddProductCommand.withName("a".repeat(51)), "name", "Invalid product name"],
            [givenAddProductCommand.withPrice(0), "price", "Invalid product price"],
            [givenAddProductCommand.withAmount(0), "amount", "Invalid product amount"],
            [givenAddProductCommand.withoutAmount(), "amount", "Missing product amount"],
            [givenAddProductCommand.withoutAssortmentId(), "assortmentId", "Missing assortment id"],
        ];

        it.each(parameters)("when one parameter invalid", (command, expectedFieldName, expectedMessage) => {
            assortmentService.addProduct(command);

            thenProductNotAdded();
            thenProductCouldNotBeAddedEventPublished().hasOnlyOneError(expectedFieldName, expectedMessage);
        })

        test('when all required values are missing', () => {
            let command = givenAddProductCommand.withoutRequiredValues();

            assortmentService.addProduct(command);

            thenProductNotAdded();
            thenProductCouldNotBeAddedEventPublished()
                .hasErrors(4)
                .hasError("assortmentId", "Missing assortment id")
                .hasError("name", "Missing product name")
                .hasError("price", "Missing product price")
                .hasError("amount", "Missing product amount");
        })

        test('when all values are invalid', () => {
            let command = new AddProductCommand(NO_VALUE, 0, "aaaa", 0, VALID_CATEGORY);

            assortmentService.addProduct(command);

            thenProductNotAdded();
            thenProductCouldNotBeAddedEventPublished()
                .hasErrors(4)
                .hasError("assortmentId", "Missing assortment id")
                .hasError("name", "Invalid product name")
                .hasError("price", "Invalid product price")
                .hasError("amount", "Invalid product amount");
        })
    });

    test('should publish ProductCouldNotBeAdded event when product could not be added', () => {
        givenValidationErrorsWhenAddingProduct();
        let command = givenAddProductCommand.withoutDescription();

        assortmentService.addProduct(command);

        thenProductCouldNotBeAddedEventPublished()
            .hasErrors(2)
            .hasError("name", "something wrong with the name")
            .hasError("amount", "I cannot handle such amount of products");
    })
})
