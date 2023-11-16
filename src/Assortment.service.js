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
                throw new Error("Invalid Product");
            }
            if(typeof dto[validationField.name] !== validationField.type) {
                throw new Error("Invalid Type")
            }
        })
    }

    addProduct(dto) {
        this.validateProduct(dto);
        this.shopClient.addProduct(dto);
    }
}

module.exports = AssortmentService;