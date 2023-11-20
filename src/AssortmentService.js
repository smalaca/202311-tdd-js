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
        if (command.getAssortmentId() === undefined) {
            this.#eventPublisher.publish(new ProductCouldNotBeAdded([ new ValidationError("assortmentId", "Missing assortment id")]));

            return;
        }

        if (command.getName() === undefined) {
            this.#eventPublisher.publish(new ProductCouldNotBeAdded([ new ValidationError("name", "Missing product name")]));

            return;
        }

        if (command.getCode() === undefined) {
            this.#eventPublisher.publish(new ProductCouldNotBeAdded([ new ValidationError("code", "Missing product code")]));

            return;
        }

        if (command.getPrice() === undefined) {
            this.#eventPublisher.publish(new ProductCouldNotBeAdded([ new ValidationError("price", "Missing product price")]));

            return;
        }

        if (command.getAmount() === undefined) {
            this.#eventPublisher.publish(new ProductCouldNotBeAdded([ new ValidationError("amount", "Missing product amount")]));

            return;
        }

        if (this.#isInvalidName(command.getName())) {
            this.#eventPublisher.publish(new ProductCouldNotBeAdded([ new ValidationError("name", "Invalid product name")]));

            return;
        }

        if (this.#isInvalidCode(command.getCode())) {
            this.#eventPublisher.publish(new ProductCouldNotBeAdded([ new ValidationError("code", "Invalid product code")]));

            return;
        }

        if (command.getPrice() < 1) {
            this.#eventPublisher.publish(new ProductCouldNotBeAdded([ new ValidationError("price", "Invalid product price")]));

            return;
        }

        if (command.getAmount() < 1) {
            this.#eventPublisher.publish(new ProductCouldNotBeAdded([ new ValidationError("amount", "Invalid product amount")]));

            return;
        }

        let response = this.#shopClient.addProduct(command);

        if (response.success === true) {
            this.#eventPublisher.publish(this.#asProductAdded(response, command))
        } else {
            this.#eventPublisher.publish(new ProductCouldNotBeAdded(response.errors))
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