class AssortmentService {
    constructor(shopClient) {
        this.shopClient = shopClient;
    }

    validateProduct(dto) {
        const requiredFields = ["name", "code", "price"]
        requiredFields.forEach((ele) => {
            if(!dto[ele]) {
                throw new Error("Invalid Product");
            }
        })
    }

    addProduct(dto) {
        this.validateProduct(dto);
        this.shopClient.addProduct(dto);
    }
}

module.exports = AssortmentService;