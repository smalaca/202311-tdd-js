class AssortmentService {
    constructor(shopClient) {
        this.shopClient = shopClient;
    }

    addProduct(dto) {
        if (!dto.code) throw new Error("Invalid product code");
        this.shopClient.addProduct(dto);
    }
}

module.exports = AssortmentService;