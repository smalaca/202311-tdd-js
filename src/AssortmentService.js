const ProductAdded = require("./ProductAdded");
const ProductCouldNotBeAdded = require("./ProductCouldNotBeAdded");
const AddProductCommand = require("./AddProductCommand")

class ProductAddedFactory {
    create(response, amount, dto) {
        return new ProductAdded(
            response.productId,
            amount,
            dto.name,
            dto.code,
            dto.price,
            dto.description
        );
    }
}

class AssortmentService {
    static #ALLOWED_ATTRIBUTES = ["name", "code", "price", "description"];
    #shopClient;
    #eventPublisher;

    constructor(shopClient, eventPublisher) {
        this.#shopClient = shopClient;
        this.#eventPublisher = eventPublisher;
    }

    addProduct(command, dto) {
        this.#validate(dto, command);

        let response = this.#shopClient.addProduct(command);

        if (response.success === true) {
            this.#eventPublisher.publish(new ProductAddedFactory().create(response, command.getAmount(), dto))
        } else {
            this.#eventPublisher.publish(new ProductCouldNotBeAdded(response.errors))
        }
    }

    #validate(dto, command) {
        if (this.#hasNotExpectedAttribute(dto)) {
            throw new Error("Attribute not expected");
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

    #hasNotExpectedAttribute(dto) {
        return !Object.keys(dto).every(attribute => {
            return AssortmentService.#ALLOWED_ATTRIBUTES.includes(attribute);
        });
    }
}

module.exports = AssortmentService;