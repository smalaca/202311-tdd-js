class AddProductCommand {
    #assortmentId;
    #amount;
    #categories;
    #name;
    #code;
    #price;
    #description;
    #creationDate;
    constructor(assortmentId, amount, name, price, categories, description) {
        this.#assortmentId = assortmentId;
        this.#amount = amount;
        this.#name = name;
        this.#price = price;
        this.#categories = categories;
        this.#description = description;
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

    setCode(code) {
        this.#code = code;
    }

    getPrice() {
        return this.#price;
    }

    getDescription() {
        return this.#description;
    }

    getAssortmentId() {
        return this.#assortmentId;
    }

    getCreationDate() {
        return this.#creationDate;
    }

    getCategories() {
        return this.#categories;
    }

    setCategories(categories) {
        this.#categories = categories;
    }
}

module.exports = AddProductCommand;