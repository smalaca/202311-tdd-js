class ProductCouldNotBeAdded {
    #errors;
    #creationDate;

    constructor(errors) {
        if (errors === undefined) {
            this.#errors = [];
        } else {
            this.#errors = errors;
        }
    }

    addError(error) {
        this.#errors.push(error);
    }

    getErrors() {
        return this.#errors;
    }

    getCreationDate() {
        return this.#creationDate;
    }

    hasNoErrors() {
        return this.#errors.length === 0;
    }
}

module.exports = ProductCouldNotBeAdded;