class ProductAdded {
    #productId;
    #amount;
    #name;
    #code;
    #price;
    constructor(productId, amount, name, code, price) {
        this.#productId = productId;
        this.#amount = amount;
        this.#name = name;
        this.#code = code;
        this.#price = price;
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
        return "";
    }
}

module.exports = ProductAdded;