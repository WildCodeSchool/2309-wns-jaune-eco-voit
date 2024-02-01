"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterParser = void 0;
const lodash_1 = require("lodash");
class ParameterParser {
    constructor() {
        /**
         * @type {number}
         */
        this.priority = 60;
    }
    static get regExp() {
        return /<\{(.+?)\}>/gm;
    }
    isSupport(value) {
        return ParameterParser.regExp.test(value);
    }
    parse(value, fixture) {
        const chunks = (0, lodash_1.chunk)(value.split(ParameterParser.regExp), 2);
        const result = [];
        for (const [str, parameter] of chunks) {
            result.push(str);
            if (parameter) {
                const parameterValue = (0, lodash_1.get)(fixture.parameters, parameter);
                if (parameterValue === undefined) {
                    if (parameter.startsWith('process.env')) {
                        const key = parameter.replace('process.env.', '');
                        if (key in process.env) {
                            result.push(process.env[key]);
                        }
                        else {
                            throw new Error(`Unkown environment variable "${parameter}" in ${fixture.name}`);
                        }
                    }
                    else {
                        throw new Error(`Unknown parameter "${parameter}" in ${fixture.name}`);
                    }
                }
                result.push(parameterValue);
            }
        }
        return result.join('');
    }
}
exports.ParameterParser = ParameterParser;
//# sourceMappingURL=ParameterParser.js.map