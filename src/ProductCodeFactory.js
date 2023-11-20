class ProductCodeFactory {

    create(name) {
        return name.replaceAll(' ', '-');
    }
}

module.exports = ProductCodeFactory;