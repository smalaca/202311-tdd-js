class ProductCodeFactory {

    create(name) {
        return name.replaceAll(' ', '-').substring(0, 15);
    }
}

module.exports = ProductCodeFactory;