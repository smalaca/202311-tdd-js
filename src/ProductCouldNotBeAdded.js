class ProductCouldNotBeAdded {
    #errors;
    #creationDate;
    #id;

    constructor(id, creationDate, errors) {
        this.#id = id;
        this.#creationDate = creationDate;
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

    getId() {
        return this.#id;
    }

    hasNoErrors() {
        return this.#errors.length === 0;
    }
}

module.exports = ProductCouldNotBeAdded;