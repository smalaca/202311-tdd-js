class AssortmentService {
    constructor(shopClient) {
        this.shopClient = shopClient;
    }

    addProduct(dto) {
        if (!dto.code) throw new Error("Invalid product code");
        if (!dto.name) throw new Error("Invalid product name");
        if (!dto.price || typeof dto.price !== 'number') throw new Error("Invalid product price");
        this.shopClient.addProduct(dto);
    }
}

module.exports = AssortmentService;
