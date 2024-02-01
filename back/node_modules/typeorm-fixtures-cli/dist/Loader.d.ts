import { IFixturesConfig } from './interface';
export declare class Loader {
    fixtureConfigs: IFixturesConfig[];
    private loaders;
    constructor();
    /**
     * @param {string} fixturesPath
     */
    load(fixturesPath: string): void;
}
