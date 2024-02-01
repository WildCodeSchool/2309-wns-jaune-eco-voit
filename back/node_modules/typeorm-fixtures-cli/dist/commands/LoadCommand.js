#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadCommand = void 0;
require("reflect-metadata");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const cliProgress = require("cli-progress");
const resolveFrom = require("resolve-from");
const CommandUtils_1 = require("typeorm/commands/CommandUtils");
const Builder_1 = require("../Builder");
const util_1 = require("../util");
const Loader_1 = require("../Loader");
const Parser_1 = require("../Parser");
const Resolver_1 = require("../Resolver");
class LoadCommand {
    constructor() {
        this.command = 'load <paths...>';
        this.describe = 'Load fixtures.';
        this.withDebug = false;
    }
    builder(args) {
        return args
            .positional('paths', {
            demandOption: true,
            describe: 'Fixtures folder/file paths.',
        })
            .option('dataSource', {
            alias: 'd',
            default: 'dataSource.ts',
            demandOption: true,
            describe: 'Path to the file where your DataSource instance is defined.',
            string: true, // eslint-disable-line id-denylist
        })
            .option('require', {
            array: true,
            default: [],
            describe: 'A list of additional modules. e.g. ts-node/register.',
            string: true, // eslint-disable-line id-denylist
        })
            .boolean('ignoreDecorators')
            .boolean('sync')
            .boolean('debug')
            .boolean('color')
            .describe({
            color: 'Enable / disable color output (default: --color).',
            debug: 'Enable / disable debug (default: --debug).',
            ignoreDecorators: 'Enable / disable "ignoreDecorator" option of class-transformer. (default: --no-ignoreDecorators)',
            sync: 'Enable / disable database schema sync (default: --no-sync).',
        })
            .default({
            color: true,
            debug: true,
            ignoreDecorators: false,
            sync: false,
        });
    }
    async handler(args) {
        const withDebug = args.debug;
        for (const req of args.require) {
            require(resolveFrom.silent(process.cwd(), req) || req);
        }
        const dataSourcePath = path.resolve(args.dataSource);
        if (!fs.existsSync(dataSourcePath)) {
            throw new Error(`TypeOrm config ${dataSourcePath} not found`);
        }
        let dataSource = undefined;
        try {
            if (withDebug) {
                console.log(chalk.grey('Connection to database...')); // eslint-disable-line
            }
            dataSource = await CommandUtils_1.CommandUtils.loadDataSource(dataSourcePath);
            await dataSource.initialize();
            if (args.sync) {
                if (withDebug) {
                    console.log(chalk.grey('Synchronize database schema')); // eslint-disable-line
                }
                await dataSource.synchronize(true);
            }
            if (withDebug) {
                console.log(chalk.grey('Loading fixtureConfigs')); // eslint-disable-line
            }
            const loader = new Loader_1.Loader();
            args.paths.forEach((fixturePath) => {
                loader.load(path.resolve(fixturePath));
            });
            const bar = new cliProgress.Bar({
                format: `${chalk.yellow('Progress')} ${chalk.green('[{bar}]')} ${chalk.yellow('{percentage}% | ETA: {eta}s | {value}/{total} {name}')} `,
                barCompleteChar: '\u2588',
                barIncompleteChar: '\u2591',
                fps: 5,
                stream: process.stdout,
                barsize: 50,
            });
            if (withDebug) {
                console.log(chalk.grey('Resolving fixtureConfigs')); // eslint-disable-line
            }
            const resolver = new Resolver_1.Resolver();
            const fixtures = resolver.resolve(loader.fixtureConfigs);
            const builder = new Builder_1.Builder(dataSource, new Parser_1.Parser(), args.ignoreDecorators);
            bar.start(fixtures.length, 0, { name: '' });
            for (const fixture of (0, util_1.fixturesIterator)(fixtures)) {
                const entity = await builder.build(fixture);
                try {
                    bar.increment(1, { name: fixture.name });
                    await dataSource.getRepository(fixture.entity).save(entity);
                }
                catch (e) {
                    bar.stop();
                    throw e;
                }
            }
            bar.update(fixtures.length, { name: '' });
            bar.stop();
            if (withDebug) {
                console.log(chalk.grey('Database disconnect')); // eslint-disable-line
            }
            await dataSource.destroy();
            process.exit(0);
        }
        catch (err) {
            console.log(chalk.red('Fail fixture loading: ' + err.message)); // eslint-disable-line
            if (dataSource) {
                await dataSource.destroy();
            }
            process.exit(1);
        }
    }
}
exports.LoadCommand = LoadCommand;
//# sourceMappingURL=LoadCommand.js.map