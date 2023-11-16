const INVALID = require('./Errors')
const AssortmentValidator = require('./Assortment.controller');
class AssortmentService {
    #productList = []
    constructor(shopClient) {
        this.shopClient = shopClient;
    }

    getProducts() {
        return this.#productList;
    }

    addProduct(dto, amount) {
        AssortmentValidator.validateProduct(dto);
        this.shopClient.addProduct(dto);
        this.#productList.push(dto);
    }
}

module.exports = AssortmentService;