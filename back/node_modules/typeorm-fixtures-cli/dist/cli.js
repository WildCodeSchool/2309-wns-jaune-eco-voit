#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const yargs = require("yargs");
const LoadCommand_1 = require("./commands/LoadCommand");
// eslint-disable-next-line @typescript-eslint/no-unused-expressions,no-unused-expressions
yargs
    .usage('Usage: $0 <command> [options]')
    .command(new LoadCommand_1.LoadCommand())
    .recommendCommands()
    .demandCommand(1)
    .strict()
    .version(require('../package.json').version)
    .alias('v', 'version')
    .help('h')
    .alias('h', 'help').argv;
//# sourceMappingURL=cli.js.map