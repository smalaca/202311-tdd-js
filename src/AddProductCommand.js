class AddProductCommand {
    #amount;
    #name;
    #code;
    #price;
    #description;
    #assortmentId;
    constructor(amount, name, code, price, description, assortmentId) {
        this.#amount = amount;
        this.#name = name;
        this.#code = code;
        this.#price = price;
        this.#description = description;
        this.#assortmentId = assortmentId;
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

    getAssortmentId() {
        return this.#assortmentId;
    }
}

module.exports = AddProductCommand;