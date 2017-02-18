import { KeywordInterpreter, KeywordContext } from '../../../chat/dist/server/language';
import { Context } from '../../../chat-date';
import { Weather } from './service';
import './service';
import { Translator } from 'akala-server';
export declare type KeywordWithTimeContext = KeywordContext & Context;
export declare class WeatherInterpreter extends KeywordInterpreter {
    private weather;
    private translate;
    constructor(weather: Weather, translate: Translator);
    actions: {
        "which": string[];
        "is": string[];
    };
    keywords: {
        "temperature": string[];
        "rain": string[];
    };
    others: {
        "useless": string[];
    };
    execute(context: KeywordWithTimeContext, next: (error?: any) => void, callback: (answer: string) => void): void;
    understand(context: KeywordWithTimeContext): void;
}
