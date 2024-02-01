import { IFixture, IParser } from '../interface';
export declare class ParameterParser implements IParser {
    /**
     * @type {number}
     */
    priority: number;
    private static get regExp();
    isSupport(value: string): boolean;
    parse(value: string, fixture: IFixture): any;
}
