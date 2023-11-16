class AssortmentService {
    constructor(shopClient) {
        this.shopClient = shopClient;
    }

    addProduct(dto) {
        if (!dto.code || typeof dto.code !== 'string') throw new Error("Invalid product code");
        if (!dto.name || typeof dto.name !== 'string') throw new Error("Invalid product name");
        if (!dto.price || typeof dto.price !== 'number') throw new Error("Invalid product price");
        this.shopClient.addProduct(dto);
    }
}

module.exports = AssortmentService;
