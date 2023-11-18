const ShopClient = require("./ShopClient.js")


class AssortmentService {
    static #ALLOWED_ATTRIBUTES = ["name", "code", "price", "description"];
    #shopClient;

    constructor(shopClient) {
        this.#shopClient = shopClient;
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

        if (this.#isInvalid(dto.code)) {
            throw new Error("Invalid product code");
        }

        this.#shopClient.addProduct(dto, amount);
    }

    #isInvalid(code) {
        return code.length < 30;
    }

    #hasNotExpectedAttribute(dto) {
        return !Object.keys(dto).every(attribute => {
            return AssortmentService.#ALLOWED_ATTRIBUTES.includes(attribute);
        });
    }
}

module.exports = AssortmentService;