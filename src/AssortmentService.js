class AssortmentService {
    constructor(shopClient) {
        this.shopClient = shopClient;
    }

    addProduct(dto) {
        this.shopClient.addProduct(dto);
    }
}

module.exports = AssortmentService;