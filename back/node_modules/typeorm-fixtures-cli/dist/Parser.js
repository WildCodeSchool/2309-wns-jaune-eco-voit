"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const parsers = require("./parsers");
class Parser {
    constructor() {
        this.parsers = [];
        for (const parser of Object.values(parsers)) {
            this.parsers.push(new parser());
        }
    }
    /**
     * @param {object | null | any} data
     * @param {IFixture} fixture
     * @param entities
     * @return {any}
     */
    parse(data, fixture, entities) {
        if (data === null) {
            return null;
        }
        const entityRawData = data instanceof Array ? [...data] : { ...data };
        for (const [key, value] of Object.entries(entityRawData)) {
            /* istanbul ignore else */
            if (typeof value === 'string') {
                for (const parser of this.parsers.sort((a, b) => b.priority - a.priority)) {
                    if (parser.isSupport(value)) {
                        entityRawData[key] = parser.parse(value, fixture, entities);
                    }
                }
            }
            /* istanbul ignore else */
            if (typeof value === 'object') {
                entityRawData[key] = this.parse(value, fixture, entities);
            }
        }
        return entityRawData;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map