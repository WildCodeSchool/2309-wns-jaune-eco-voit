import { IFixturesConfig, ILoader } from '../interface';
export declare class TsLoader implements ILoader {
    extensionSupport: string[];
    isSupport(filePath: string): boolean;
    load(filePath: string): IFixturesConfig;
}
