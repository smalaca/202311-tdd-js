class ProductAdded {
    #productId;
    #amount;
    #name;
    #code;
    #price;
    #description;
    constructor(productId, amount, name, code, price, description) {
        this.#productId = productId;
        this.#amount = amount;
        this.#name = name;
        this.#code = code;
        this.#price = price;
        this.#description = description;
    }

    getProductId() {
        return this.#productId;
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