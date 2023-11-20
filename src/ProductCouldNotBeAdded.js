class ProductCouldNotBeAdded {
    #errors;
    constructor(errors) {
        this.#errors = errors;
    }

    getErrors() {
        return this.#errors;
    }
}

module.exports = ProductCouldNotBeAdded;