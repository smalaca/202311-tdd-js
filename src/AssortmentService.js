const ProductAdded = require("./ProductAdded");
const ProductCouldNotBeAdded = require("./ProductCouldNotBeAdded");
const ValidationError = require("./ValidationError");

class AssortmentService {
    #shopClient;
    #eventPublisher;

    constructor(shopClient, eventPublisher) {
        this.#shopClient = shopClient;
        this.#eventPublisher = eventPublisher;
    }

    addProduct(command) {
        let event = new ProductCouldNotBeAdded();

        if (command.getAssortmentId() === undefined) {
            event.addError(new ValidationError("assortmentId", "Missing assortment id"));
        }

        if (command.getName() === undefined) {
            event.addError(new ValidationError("name", "Missing product name"));
        } else if (this.#isInvalidName(command.getName())) {
            event.addError(new ValidationError("name", "Invalid product name"));
        }

        if (command.getCode() === undefined) {
            event.addError(new ValidationError("code", "Missing product code"));
        } else if (this.#isInvalidCode(command.getCode())) {
            event.addError(new ValidationError("code", "Invalid product code"));
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

        if (event.hasNoErrors()) {
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

    #isInvalidCode(code) {
        return !code.match(/^[0-9-]{30}$/);
    }

    #isInvalidName(name) {
        return name.length < 5 || name.length > 50;
    }
}

module.exports = AssortmentService;