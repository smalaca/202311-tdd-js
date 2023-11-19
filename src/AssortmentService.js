const ShopClient = require("./ShopClient.js")
const ProductAdded = require("./ProductAdded");


class AssortmentService {
    static #ALLOWED_ATTRIBUTES = ["name", "code", "price", "description"];
    #shopClient;
    #eventPublisher;

    constructor(shopClient, eventPublisher) {
        this.#shopClient = shopClient;
        this.#eventPublisher = eventPublisher;
    }

    addProduct(dto, amount) {
        if (this.#hasNotExpectedAttribute(dto)) {
            throw new Error("Attribute not expected");
        }

        if (dto.name === undefined) {
            throw new Error("Missing product name");
        }

        if (dto.code === undefined) {
            throw new Error("Missing product code");
        }

        if (dto.price === undefined) {
            throw new Error("Missing product price");
        }

        if (amount === undefined) {
            throw new Error("Missing product amount");
        }

        if (this.#isInvalidName(dto.name)) {
            throw new Error("Invalid product name");
        }

        if (this.#isInvalidCode(dto.code)) {
            throw new Error("Invalid product code");
        }

        if (dto.price < 1) {
            throw new Error("Invalid product price");
        }

        if (amount < 1) {
            throw new Error("Invalid product amount");
        }

        let status = this.#shopClient.addProduct(dto, amount);

        if (status.success === true) {
            this.#eventPublisher.publish(new ProductAdded(
                status.productId,
                amount,
                dto.name,
                dto.code,
                dto.price
            ))
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