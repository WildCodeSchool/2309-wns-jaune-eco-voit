#!/usr/bin/env node
import 'reflect-metadata';
import * as yargs from 'yargs';
export declare class LoadCommand implements yargs.CommandModule {
    command: string;
    describe: string;
    private withDebug;
    builder(args: yargs.Argv): yargs.Argv<yargs.Omit<{
        paths: unknown;
    } & {
        dataSource: string;
    } & {
        require: never[];
    } & {
        ignoreDecorators: boolean | undefined;
    } & {
        sync: boolean | undefined;
    } & {
        debug: boolean | undefined;
    } & {
        color: boolean | undefined;
    }, "debug" | "color" | "ignoreDecorators" | "sync"> & {
        color: boolean;
        debug: boolean;
        ignoreDecorators: boolean;
        sync: boolean;
    }>;
    handler(args: yargs.Arguments): Promise<void>;
}
