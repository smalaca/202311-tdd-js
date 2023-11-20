class ProductCodeFactory {
    static #CODE_LENGTH = 30;

    create(name) {
        let fromName = name.replaceAll(' ', '-').substring(0, 15).replace(/[^a-zA-Z0-9-]/g, "");
        let leftToFill = this.#randomAlphaNumeric(ProductCodeFactory.#CODE_LENGTH - fromName.length);

        return fromName + leftToFill;
    }

    #randomAlphaNumeric(length) {
        let s = '';
        Array.from({ length }).some(() => {
            s += Math.random().toString(36).slice(2);
            return s.length >= length;
        });
        return s.slice(0, length);
    };
}

module.exports = ProductCodeFactory;