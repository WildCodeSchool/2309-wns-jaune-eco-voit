"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakerParser = void 0;
const faker_1 = require("@faker-js/faker");
class FakerParser {
    constructor() {
        /**
         * @type {number}
         */
        this.priority = 70;
    }
    isSupport(value) {
        return /\{\{.+}}/gm.test(value);
    }
    parse(value, fixture) {
        if (fixture === null || fixture === void 0 ? void 0 : fixture.locale) {
            faker_1.faker.locale = fixture.locale;
        }
        const result = faker_1.faker.helpers.fake(value);
        if ((+result).toString() === result) {
            return +result;
        }
        else if (result === 'true' || result === 'false') {
            return result === 'true';
        }
        else {
            return result;
        }
    }
}
exports.FakerParser = FakerParser;
//# sourceMappingURL=FakerParser.js.map