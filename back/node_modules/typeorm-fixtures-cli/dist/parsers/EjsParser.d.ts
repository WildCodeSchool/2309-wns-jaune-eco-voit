import { IFixture, IParser } from '../interface';
export declare class EjsParser implements IParser {
    /**
     * @type {number}
     */
    priority: number;
    isSupport(value: string): boolean;
    parse(value: string, fixture: IFixture): any;
}
