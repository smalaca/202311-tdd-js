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
        requiredFields.forEach((ele) => {
            if(!dto[ele.name]) {
                throw new Error("Invalid Product");
            }
            if(typeof dto[ele.name] !== ele.type) {
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