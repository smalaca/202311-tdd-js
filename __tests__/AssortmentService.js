const ShopClient = require("./ShopClient.js")

class AssortmentService {
    #shopClient;

    constructor(shopClient) {
        this.#shopClient = shopClient;
    }

    addProduct(dto) {
        this.#shopClient.addProduct(dto);
    }
}

module.exports = AssortmentService;