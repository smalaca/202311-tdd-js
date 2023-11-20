const ProductAdded = require("./ProductAdded");
const ProductCouldNotBeAdded = require("./ProductCouldNotBeAdded");

class AssortmentService {
    #shopClient;
    #eventPublisher;

    constructor(shopClient, eventPublisher) {
        this.#shopClient = shopClient;
        this.#eventPublisher = eventPublisher;
    }

    addProduct(command) {
        this.#validate(command);

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

    #validate(command) {
        if (command.getAssortmentId() === undefined) {
            throw new Error("Missing assortmentId");
        }

        if (command.getName() === undefined) {
            throw new Error("Missing product name");
        }

        if (command.getCode() === undefined) {
            throw new Error("Missing product code");
        }

        if (command.getPrice() === undefined) {
            throw new Error("Missing product price");
        }

        if (command.getAmount() === undefined) {
            throw new Error("Missing product amount");
        }

        if (this.#isInvalidName(command.getName())) {
            throw new Error("Invalid product name");
        }

        if (this.#isInvalidCode(command.getCode())) {
            throw new Error("Invalid product code");
        }

        if (command.getPrice() < 1) {
            throw new Error("Invalid product price");
        }

        if (command.getAmount() < 1) {
            throw new Error("Invalid product amount");
        }
    }

    #isInvalidCode(code) {
        return !code.match(/^[0-9-]{30}$/);
    }

    #isInvalidName(name) {
        return name.length < 5 || name.length > 50;
    }
}

module.exports = AssortmentService;