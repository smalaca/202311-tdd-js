const AddProductCommand = require("../src/AddProductCommand");

class GivenAddProductCommand {
    #NO_VALUE = undefined;
    #assortmentId;
    #amount;
    #name;
    #price;
    #description;

    constructor(assortmentId, amount, name, price, description) {
        this.#assortmentId = assortmentId;
        this.#amount = amount;
        this.#name = name;
        this.#price = price;
        this.#description = description;
    }

    withoutDescription() {
        return new AddProductCommand(this.#assortmentId, this.#amount, this.#name, this.#price, this.#NO_VALUE);
    }

    withDescription() {
        return new AddProductCommand(this.#assortmentId, this.#amount, this.#name, this.#price, this.#description);
    }

    withoutName() {
        return new AddProductCommand(this.#assortmentId, this.#amount, this.#NO_VALUE, this.#price, this.#description);
    }

    withoutPrice() {
        return new AddProductCommand(this.#assortmentId, this.#amount, this.#name, this.#NO_VALUE, this.#description);
    }

    withoutRequiredValues() {
        return new AddProductCommand(this.#NO_VALUE, this.#NO_VALUE, this.#NO_VALUE, this.#NO_VALUE);
    }

    withoutAssortmentId() {
        return new AddProductCommand(this.#NO_VALUE, this.#amount, this.#name, this.#price, this.#description);
    }

    withoutAmount() {
        return new AddProductCommand(this.#assortmentId, this.#NO_VALUE, this.#name, this.#price, this.#description);
    }

    withAmount(amount) {
        return new AddProductCommand(this.#assortmentId, amount, this.#name, this.#price, this.#description);
    }

    withPrice(price) {
        return new AddProductCommand(this.#assortmentId, this.#amount, this.#name, price, this.#description);
    }

    withName(name) {
        return new AddProductCommand(this.#assortmentId, this.#amount, name, this.#price, this.#description);
    }
}

module.exports = GivenAddProductCommand;