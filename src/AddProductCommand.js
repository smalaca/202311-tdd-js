class AddProductCommand {
    #assortmentId;
    #amount;
    #category;
    #name;
    #code;
    #price;
    #description;
    constructor(assortmentId, amount, name, price, category, description) {
        this.#assortmentId = assortmentId;
        this.#amount = amount;
        this.#name = name;
        this.#price = price;
        this.#category = category;
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

    getCategory() {
        return this.#category;
    }
}

module.exports = AddProductCommand;