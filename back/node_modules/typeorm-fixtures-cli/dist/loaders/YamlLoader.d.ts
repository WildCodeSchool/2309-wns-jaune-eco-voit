import { IFixturesConfig, ILoader } from '../interface';
export declare class YamlLoader implements ILoader {
    extensionSupport: string[];
    isSupport(filePath: string): boolean;
    load(filePath: string): IFixturesConfig;
}
