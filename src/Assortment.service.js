const INVALID = require('./Errors')
const AssortmentValidator = require('./Assortment.controller');
class AssortmentService {
    constructor(shopClient) {
        this.shopClient = shopClient;
    }



    addProduct(dto, amount) {
        AssortmentValidator.validateProduct(dto);
        this.shopClient.addProduct(dto);
    }
}

module.exports = AssortmentService;