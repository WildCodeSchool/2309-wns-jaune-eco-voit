import { IParser, IFixture } from '../interface';
export declare class ReferenceParser implements IParser {
    /**
     * @type {number}
     */
    priority: number;
    isSupport(value: string): boolean;
    parse(value: string, fixture: IFixture, entities: any): any;
}
