"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceParser = void 0;
const lodash_1 = require("lodash");
class ReferenceParser {
    constructor() {
        /**
         * @type {number}
         */
        this.priority = 50;
    }
    isSupport(value) {
        return value.indexOf('@') === 0;
    }
    parse(value, fixture, entities) {
        let result;
        if (value.substring(value.length - 1) === '*') {
            const prefix = value.substring(1, value.length);
            const regex = new RegExp(`^${prefix}([0-9]+)$`);
            const maskEntities = Object.keys(entities).filter((s) => regex.test(s));
            result = entities[maskEntities[(0, lodash_1.random)(maskEntities.length - 1)]];
        }
        else {
            result = entities[value.substring(1)];
        }
        if (!result) {
            throw new Error(`Reference "${value}" not found`);
        }
        return result;
    }
}
exports.ReferenceParser = ReferenceParser;
//# sourceMappingURL=ReferenceParser.js.map