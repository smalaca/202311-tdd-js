const AddProductCommand = require("../src/AddProductCommand");

class GivenAddProductCommand {
    NO_VALUE = undefined;
    assortmentId;
    amount;
    name;
    price;
    description;

    constructor(assortmentId, amount, name, price, description) {
        this.assortmentId = assortmentId;
        this.amount = amount;
        this.name = name;
        this.price = price;
        this.description = description;
    }

    withoutName() {
        return new AddProductCommand(this.assortmentId, this.amount, this.NO_VALUE, this.price, this.description);
    }

    withoutPrice() {
        return new AddProductCommand(this.assortmentId, this.amount, this.name, this.NO_VALUE, this.description);
    }
}

module.exports = GivenAddProductCommand;