const INVALID = require('./Errors')

class AssortmentValidator {
    static validateProduct(dto) {
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
}

module.exports = AssortmentValidator;