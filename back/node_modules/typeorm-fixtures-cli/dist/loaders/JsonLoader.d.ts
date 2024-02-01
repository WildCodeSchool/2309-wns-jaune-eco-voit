import { IFixturesConfig, ILoader } from '../interface';
export declare class JsonLoader implements ILoader {
    extensionSupport: string[];
    isSupport(filePath: string): boolean;
    load(filePath: string): IFixturesConfig;
}
