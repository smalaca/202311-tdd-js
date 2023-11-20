class ValidationError {
    fieldName;
    description;

    constructor(fieldName, description) {
        this.fieldName = fieldName;
        this.description = description;
    }
}

module.exports = ValidationError;