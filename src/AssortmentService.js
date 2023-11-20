const ShopClient = require("./ShopClient.js")
const ProductAdded = require("./ProductAdded");
const ProductCouldNotBeAdded = require("./ProductCouldNotBeAdded");
const AddProductDto = require('./AddProductDto.js');


class AssortmentService {
    static #ALLOWED_ATTRIBUTES = ["name", "code", "price", "description"];
    #shopClient;
    #eventPublisher;

    constructor(shopClient, eventPublisher) {
        this.#shopClient = shopClient;
        this.#eventPublisher = eventPublisher;
    }

    addProduct(dto, amount, assortmentId) {
        const validationResult = this.validate(dto, amount);

        if (!validationResult.success) return validationResult;

        const addProductDto = new AddProductDto({ ...dto, amount, assortmentId });

        let status = this.#shopClient.addProduct(addProductDto);

        if (status.success === true) {
            this.#eventPublisher.publish(new ProductAdded(
                status.productId,
                amount,
                dto.name,
                dto.code,
                dto.price,
                dto.description
            ))
        } else {
            this.#eventPublisher.publish(new ProductCouldNotBeAdded(status.errors))
        }
    }

    validate = (dto, amount) => {
        const errors = [];
        
        if (this.#hasNotExpectedAttribute(dto)) {
            errors.push({
                description: "Attribute not expected"
            });
        }
        
        if (dto.name === undefined) {
            errors.push({
                fieldName: "name",
                description: "Missing product name"
            });
        }

        if (dto.code === undefined) {
            errors.push({
                fieldName: "code",
                description: "Missing product code"
            });
        }

        if (dto.price === undefined) {
            errors.push({
                fieldName: "price",
                description: "Missing product price"
            });
        }

        if (amount === undefined) {
            errors.push({
                fieldName: "amount",
                description: "Missing product amount"
            });
        }

        if (dto.name && this.#isInvalidName(dto.name)) {
            errors.push({
                fieldName: "name",
                description: "Invalid product name"
            });
        }

        if (dto.code && this.#isInvalidCode(dto.code)) {
            errors.push({
                fieldName: "code",
                description: "Invalid product code"
            });
        }

        if (dto.price < 1) {
            errors.push({
                fieldName: "price",
                description: "Invalid product price"
            });
        }

        if (amount < 1) {
            errors.push({
                fieldName: "amount",
                description: "Invalid product amount"
            });
        }

        if (errors.length > 0) {
            return {
                success: false,
                errors
            }
        };

        return {
            success: true
        };
    }

    #isInvalidCode(code) {
        return !code.match(/^[0-9-]{30}$/);
    }

    #isInvalidName(name) {
        return name.length < 5 || name.length > 50;
    }

    #hasNotExpectedAttribute(dto) {
        return !Object.keys(dto).every(attribute => {
            return AssortmentService.#ALLOWED_ATTRIBUTES.includes(attribute);
        });
    }
}

module.exports = AssortmentService;