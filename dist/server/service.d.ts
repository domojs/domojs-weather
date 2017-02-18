import * as di from 'akala-core';
import { Settings } from '../../../settings';
export declare class Weather {
    private http;
    private settings;
    constructor(http: di.Http, settings: Settings);
    private getFromCache(method);
    getInfo(): PromiseLike<any>;
    forecast(): PromiseLike<any>;
}
