const ShopClient = require("./ShopClient.js")

class AssortmentService {
    #shopClient;

    constructor(shopClient) {
        this.#shopClient = shopClient;
    }

    addProduct(dto) {
        if (dto.name === undefined) {
            throw new Error("Missing product name");
        }

        this.#shopClient.addProduct(dto);
    }
}

module.exports = AssortmentService;