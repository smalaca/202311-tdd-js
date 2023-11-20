class ProductAdded {
    #productId;
    #assortmentId;
    #amount;
    #name;
    #code;
    #price;
    #description;
    constructor(productId, assortmentId, amount, name, code, price, description) {
        this.#productId = productId;
        this.#assortmentId = assortmentId;
        this.#amount = amount;
        this.#name = name;
        this.#code = code;
        this.#price = price;
        this.#description = description;
    }

    getProductId() {
        return this.#productId;
    }

    getAssortmentId() {
        return this.#assortmentId;
    }

    getAmount() {
        return this.#amount;
    }

    getName() {
        return this.#name;
    }

    getCode() {
        return this.#code;
    }

    getPrice() {
        return this.#price;
    }

    getDescription() {
        return this.#description;
    }
}

module.exports = ProductAdded;