const INVALID = require('./Errors')

class AssortmentService {
    constructor(shopClient) {
        this.shopClient = shopClient;
    }

    validateProduct(dto) {
        const requiredFields = [{
            name: "code",
            type: "string"
        }, {
            name: "name",
            type: "string",
        }, {
            name: "price",
            type: "number"
        }]
        requiredFields.forEach((validationField) => {
            if(!dto[validationField.name]) {
                throw new Error(INVALID.PRODUCT);
            }
            if(typeof dto[validationField.name] !== validationField.type) {
                throw new Error(INVALID.TYPE)
            }
        })
    }

    addProduct(dto) {
        this.validateProduct(dto);
        this.shopClient.addProduct(dto);
    }
}

module.exports = AssortmentService;