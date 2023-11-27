const ValidationError = require("../src/ValidationError");

class ProductCouldNotBeAddedAssertion {
    #actual;

    constructor(actual) {
        expect(actual.constructor.name).toBe("ProductCouldNotBeAdded");
        this.#actual = actual;
    }

    hasOnlyOneError(expectedFieldName, expectedMessage) {
        return this
            .hasErrors(1)
            .hasError(expectedFieldName, expectedMessage);
    }

    hasErrors(expected) {
        expect(this.#actual.getErrors()).toHaveLength(expected);

        return this;
    }

    hasError(expectedFieldName, expectedMessage) {
        expect(this.#actual.getErrors()).toContainEqual(new ValidationError(expectedFieldName, expectedMessage));

        return this;
    }
}

module.exports = ProductCouldNotBeAddedAssertion;