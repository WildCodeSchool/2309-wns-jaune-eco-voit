"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EjsParser = void 0;
const ejs = require("ejs");
class EjsParser {
    constructor() {
        /**
         * @type {number}
         */
        this.priority = 80;
    }
    isSupport(value) {
        return /<%(.+?)%>/gms.test(value);
    }
    parse(value, fixture) {
        return ejs.render(value, fixture);
    }
}
exports.EjsParser = EjsParser;
//# sourceMappingURL=EjsParser.js.map