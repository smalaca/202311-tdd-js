const ShopClient = require("./ShopClient.js")

class AssortmentService {
    #shopClient;

    constructor(shopClient) {
        this.#shopClient = shopClient;
    }

    addProduct(dto, amount) {
        if (dto.name === undefined) {
            throw new Error("Missing product name");
        }

        if (dto.code === undefined) {
            throw new Error("Missing product code");
        }

        if (dto.price === undefined) {
            throw new Error("Missing product price");
        }

        this.#shopClient.addProduct(dto, amount);
    }
}

module.exports = AssortmentService;