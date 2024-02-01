"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YamlLoader = void 0;
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
class YamlLoader {
    constructor() {
        this.extensionSupport = ['.yaml', '.yml'];
    }
    isSupport(filePath) {
        return this.extensionSupport.includes(path.extname(filePath));
    }
    load(filePath) {
        return yaml.load(fs.readFileSync(filePath).toString());
    }
}
exports.YamlLoader = YamlLoader;
//# sourceMappingURL=YamlLoader.js.map