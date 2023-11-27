const ShopClientScenario = require("./ShopClientScenario");
const AddProductCommand = require("../src/AddProductCommand");

class ShopClientContract {

    successfullyAddProductWithoutDescription() {
        return new ShopClientScenario(
            new AddProductCommand(1, 32, "somename", 123, ["book"], undefined), {
                success: true,
                productId: 42
            });
    }
}


module.exports = ShopClientContract;