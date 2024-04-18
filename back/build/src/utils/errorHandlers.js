"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertDataExists = exports.validateData = void 0;
const class_validator_1 = require("class-validator");
const validateData = async (dataToValidate) => {
    const errors = await (0, class_validator_1.validate)(dataToValidate);
    if (errors.length > 0) {
        const errorMessages = errors
            .map((error) => Object.values(error.constraints || {}))
            .flat();
        throw new Error(`Validation failed: ${errorMessages.join(', ')}`);
    }
};
exports.validateData = validateData;
const assertDataExists = (data) => {
    if (!data)
        throw new Error('Data not found');
};
exports.assertDataExists = assertDataExists;
