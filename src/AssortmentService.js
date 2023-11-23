const ProductAdded = require("./ProductAdded");
const ProductCouldNotBeAdded = require("./ProductCouldNotBeAdded");
const ValidationError = require("./ValidationError");
const ProductCodeFactory = require("./ProductCodeFactory");
const CategoryRepository = require("./CategoryRepository");

class AssortmentService {
    #shopClient;
    #eventPublisher;
    #productCodeFactory;
    #categoryRepository;

    constructor(shopClient, eventPublisher) {
        this.#shopClient = shopClient;
        this.#eventPublisher = eventPublisher;
        this.#productCodeFactory = new ProductCodeFactory();
        this.#categoryRepository = new CategoryRepository();
    }

    addProduct(command) {
        let validCategoryList = this.#categoryRepository.getValidCategories(command.getCategoryList());
        command.setCategoryList(validCategoryList);
        let event = this.validate(command);

        if (event.hasNoErrors()) {
            let code = this.#productCodeFactory.create(command.getName())
            command.setCode(code);


            let response = this.#shopClient.addProduct(command);

            if (response.success === true) {
                this.#eventPublisher.publish(this.#asProductAdded(response, command))
            } else {
                this.#eventPublisher.publish(new ProductCouldNotBeAdded(response.errors))
            }
        } else {
            this.#eventPublisher.publish(event);

        }
    }

    validate(command) {
        let event = new ProductCouldNotBeAdded();

        if (command.getAssortmentId() === undefined) {
            event.addError(new ValidationError("assortmentId", "Missing assortment id"));
        }

        if (command.getName() === undefined) {
            event.addError(new ValidationError("name", "Missing product name"));
        } else if (this.#isInvalidName(command.getName())) {
            event.addError(new ValidationError("name", "Invalid product name"));
        }

        if (command.getPrice() === undefined) {
            event.addError(new ValidationError("price", "Missing product price"));
        } else if (command.getPrice() < 1) {
            event.addError(new ValidationError("price", "Invalid product price"));
        }

        if (command.getAmount() === undefined) {
            event.addError(new ValidationError("amount", "Missing product amount"));
        } else if (command.getAmount() < 1) {
            event.addError(new ValidationError("amount", "Invalid product amount"));
        }

        const categoryList = command.getCategoryList();
        if (categoryList?.length === 0) {
            event.addError(new ValidationError("categoryList", "Empty category list"));
        }

        return event;
    }

    #asProductAdded(response, command) {
        return new ProductAdded(
            response.productId,
            command.getAssortmentId(),
            command.getAmount(),
            command.getName(),
            command.getCode(),
            command.getPrice(),
            command.getDescription()
        );
    }
    #isInvalidName(name) {
        return name.length < 5 || name.length > 50;
    }
}

module.exports = AssortmentService;