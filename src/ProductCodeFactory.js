class ProductCodeFactory {

    create(name) {
        return name.replaceAll(' ', '-').substring(0, 15).replace(/[^a-zA-Z0-9-]/g, "") + "XXXXXXXXXXXXXXX";
    }
}

module.exports = ProductCodeFactory;