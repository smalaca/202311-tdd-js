const AddProductCommand = require("../src/AddProductCommand");

class GivenAddProductCommand {
    #NO_VALUE = undefined;
    #assortmentId;
    #amount;
    #category;
    #name;
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

    withoutDescription() {
        return new AddProductCommand(this.#assortmentId, this.#amount, this.#name, this.#price, this.#category, this.#NO_VALUE);
    }

    withDescription() {
        return new AddProductCommand(this.#assortmentId, this.#amount, this.#name, this.#price, this.#category, this.#description);
    }

    withoutName() {
        return new AddProductCommand(this.#assortmentId, this.#amount, this.#NO_VALUE, this.#price, this.#category, this.#description);
    }

    withoutPrice() {
        return new AddProductCommand(this.#assortmentId, this.#amount, this.#name, this.#NO_VALUE, this.#category, this.#description);
    }

    withoutRequiredValues() {
        return new AddProductCommand(this.#NO_VALUE, this.#NO_VALUE, this.#NO_VALUE, this.#NO_VALUE, this.#NO_VALUE);
    }

    withoutAssortmentId() {
        return new AddProductCommand(this.#NO_VALUE, this.#amount, this.#name, this.#price, this.#category, this.#description);
    }

    withoutAmount() {
        return new AddProductCommand(this.#assortmentId, this.#NO_VALUE, this.#name, this.#price, this.#category, this.#description);
    }

    withAmount(amount) {
        return new AddProductCommand(this.#assortmentId, amount, this.#name, this.#price, this.#category, this.#description);
    }

    withPrice(price) {
        return new AddProductCommand(this.#assortmentId, this.#amount, this.#name, price, this.#category, this.#description);
    }

    withName(name) {
        return new AddProductCommand(this.#assortmentId, this.#amount, name, this.#price, this.#category, this.#description);
    }
}

module.exports = GivenAddProductCommand;