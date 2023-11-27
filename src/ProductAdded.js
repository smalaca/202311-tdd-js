class ProductAdded {
    #productId;
    #assortmentId;
    #amount;
    #categories;
    #name;
    #code;
    #price;
    #description;
    #creationDate;
    #id;
    constructor(id, productId, creationDate, assortmentId, amount, name, code, price, categories, description) {
        this.#id = id;
        this.#productId = productId;
        this.#creationDate = creationDate;
        this.#assortmentId = assortmentId;
        this.#amount = amount;
        this.#name = name;
        this.#code = code;
        this.#price = price;
        this.#categories = categories;
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

    getCategories() {
        return this.#categories;
    }

    getCreationDate() {
        return this.#creationDate;
    }

    getId() {
        return this.#id;
    }

    getDescription() {
        return this.#description;
    }
}

module.exports = ProductAdded;