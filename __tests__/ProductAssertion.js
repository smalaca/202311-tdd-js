class ProductAssertion {
    #actual;

    constructor(actual) {
        this.#actual = actual;
    }
    
    hasAssortmentId(expected) {
        expect(this.#actual.getAssortmentId()).toBe(expected); 
        return this;    
    }
    
    hasAmount(expected) {
        expect(this.#actual.getAmount()).toBe(expected);
        return this;    
    }
    
    hasName(expected) {
        expect(this.#actual.getName()).toBe(expected);
        return this;    
    }
    
    hasValidCodeFrom(name) {
        let actualCode = this.#actual.getCode();
        expect(actualCode.startsWith(name)).toBeTruthy();
        expect(actualCode.length).toEqual(30);
        expect(new Set(actualCode.substring(15).split("")).size).toBeGreaterThan(1);
        expect(actualCode.substring(15)).toMatch(/[a-zA-Z0-9]/);
        return this;    
    }
    
    hasPrice(expected) {
        expect(this.#actual.getPrice()).toBe(expected);
        return this;    
    }
    
    hasDescription(expected) {
        expect(this.#actual.getDescription()).toBe(expected);
        return this;    
    }
}

module.exports = ProductAssertion;