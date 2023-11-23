class AddProductCommand {
    #assortmentId;
    #amount;
    #name;
    #code;
    #price;
    #description;
    #categories;
    constructor(assortmentId, amount, name, price, description, categories) {
        this.#assortmentId = assortmentId;
        this.#amount = amount;
        this.#name = name;
        this.#price = price;
        this.#description = description;
        this.#categories = categories;
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

    getCategories() {
        return this.#categories;
    }
}

module.exports = AddProductCommand;
