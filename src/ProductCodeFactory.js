class ProductCodeFactory {
    static #CODE_LENGTH = 30;

    create(name) {
        let fromName = name.replaceAll(' ', '-').substring(0, 15).replace(/[^a-zA-Z0-9-]/g, "");
        let leftToFill = "X".repeat(ProductCodeFactory.#CODE_LENGTH - fromName.length);

        return fromName + leftToFill;
    }
}

module.exports = ProductCodeFactory;