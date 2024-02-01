"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsLoader = void 0;
const lodash_1 = require("lodash");
const path = require("path");
class TsLoader {
    constructor() {
        this.extensionSupport = ['.ts'];
    }
    isSupport(filePath) {
        return this.extensionSupport.includes(path.extname(filePath));
    }
    load(filePath) {
        return (0, lodash_1.cloneDeep)(require(filePath).default);
    }
}
exports.TsLoader = TsLoader;
//# sourceMappingURL=TsLoader.js.map