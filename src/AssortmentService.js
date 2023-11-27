const ProductAdded = require("./ProductAdded");
const ProductCouldNotBeAdded = require("./ProductCouldNotBeAdded");
const ValidationError = require("./ValidationError");
const ProductCodeFactory = require("./ProductCodeFactory");

class AssortmentService {
    #shopClient;
    #eventPublisher;
    #productCodeFactory;
    #categoryRepository;
    #clock;
    #idFactory;

    constructor(shopClient, eventPublisher, categoryRepository, clock, idFactory) {
        this.#shopClient = shopClient;
        this.#eventPublisher = eventPublisher;
        this.#categoryRepository = categoryRepository;
        this.#clock = clock;
        this.#idFactory = idFactory;
        this.#productCodeFactory = new ProductCodeFactory();
    }

    addProduct(command) {
        let event = this.validate(command);

        if (event.hasNoErrors()) {
            let code = this.#productCodeFactory.create(command.getName())
            command.setCode(code);
            command.setCategories(this.#getAllowedCategories(command.getCategories()));
            command.setCreationDate(this.#clock.now());

            let response = this.#shopClient.addProduct(command);

            if (response.success === true) {
                this.#eventPublisher.publish(this.#asProductAdded(response, command))
            } else {
                this.#eventPublisher.publish(new ProductCouldNotBeAdded(this.#idFactory.generate(), command.getCreationDate(), response.errors))
            }
        } else {
            this.#eventPublisher.publish(event);

        }
    }

    validate(command) {
        let event = new ProductCouldNotBeAdded(this.#idFactory.generate(), this.#clock.now());

        if (command.getAssortmentId() === undefined) {
            event.addError(new ValidationError("assortmentId", "Missing assortment id"));
        }

        if (command.getCategories() === undefined) {
            event.addError(new ValidationError("categories", "Missing product categories"));
        } else if (this.#areInvalidCategories(command.getCategories())) {
            event.addError(new ValidationError("categories", "Invalid product categories"));
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
        return event;
    }

    #asProductAdded(response, command) {
        return new ProductAdded(
            response.productId,
            command.getCreationDate(),
            command.getAssortmentId(),
            command.getAmount(),
            command.getName(),
            command.getCode(),
            command.getPrice(),
            command.getCategories(),
            command.getDescription()
        );
    }

    #areInvalidCategories(categories) {
        if (!Array.isArray(categories) || categories.length === 0) {
            return true;
        }

        let allowedCategories = this.#getAllowedCategories(categories);

        return allowedCategories.length === 0;
    }

    #getAllowedCategories(categories) {
        let allowedCategories = [];

        categories.forEach((value, index, array) => {
            if (this.#categoryRepository.exist(value)) {
                allowedCategories.push(value);
            }
        })

        return allowedCategories;
    }

    #isInvalidName(name) {
        return name.length < 5 || name.length > 50;
    }
}

module.exports = AssortmentService;