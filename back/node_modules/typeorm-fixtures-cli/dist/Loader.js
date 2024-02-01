"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = void 0;
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const loaders = require("./loaders");
const schema_1 = require("./schema");
class Loader {
    constructor() {
        this.fixtureConfigs = [];
        this.loaders = [];
        for (const loader of Object.values(loaders)) {
            this.loaders.push(new loader());
        }
    }
    /**
     * @param {string} fixturesPath
     */
    load(fixturesPath) {
        const extensions = this.loaders.map((l) => l.extensionSupport.map((e) => e.substr(1)).join(',')).join(',');
        let files = [];
        if (fs.lstatSync(fixturesPath).isFile()) {
            if (!this.loaders.find((l) => l.isSupport(fixturesPath))) {
                throw new Error(`File extension "${path.extname(fixturesPath)}" not support`);
            }
            files = [fixturesPath];
        }
        else {
            files = glob.sync(path
                .resolve(path.join(fixturesPath, `*.{${extensions}}`))
                .split(path.sep)
                .join('/'));
        }
        for (const file of files) {
            const loader = this.loaders.find((l) => l.isSupport(file));
            /* istanbul ignore else */
            if (loader) {
                const fixtureConfig = loader.load(file);
                const { error } = schema_1.jFixturesSchema.validate(fixtureConfig);
                if (error) {
                    throw new Error(`Invalid fixtures config. File "${file}"`);
                }
                /* istanbul ignore else */
                if (fixtureConfig.processor) {
                    fixtureConfig.processor = path.isAbsolute(fixtureConfig.processor)
                        ? path.resolve(fixtureConfig.processor)
                        : path.resolve(path.dirname(file), fixtureConfig.processor);
                }
                this.fixtureConfigs.push(fixtureConfig);
            }
        }
    }
}
exports.Loader = Loader;
//# sourceMappingURL=Loader.js.map