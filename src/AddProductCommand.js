class AddProductCommand {
    #assortmentId;
    #amount;
    #name;
    #code;
    #price;
    #description;
    #categoryList;
    constructor(assortmentId, amount, name, price, description, categoryList) {
        this.#assortmentId = assortmentId;
        this.#amount = amount;
        this.#name = name;
        this.#price = price;
        this.#description = description;
        this.#categoryList = categoryList;
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
    
    getCategoryList() {
        return this.#categoryList;
    }
}

module.exports = AddProductCommand;