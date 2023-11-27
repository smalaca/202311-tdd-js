class ShopClientScenario {
    #request;
    #response;
    constructor(request, response) {
        this.#request = request;
        this.#response = response;

    }
    getRequest() {
        new this.#request
    }

    getResponse() {
        return this.#response;
    }
}

module.exports = ShopClientScenario;