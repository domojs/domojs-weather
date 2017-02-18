import * as di from 'akala-core';
import * as Sugar from 'sugar';
import { KeywordInterpreter, KeywordContext, Interpreter } from '../../../chat/dist/server/language';
import { Context } from '../../../chat-date';
import { Weather } from './service';
import './service';
import { Translator } from 'akala-server';

export type KeywordWithTimeContext = KeywordContext & Context;


export class WeatherInterpreter extends KeywordInterpreter
{
    constructor(private weather: Weather, private translate: Translator)
    {
        super();
    }

    actions = { "which": ["quel", "quelle"], "is": ["est-ce"] };
    keywords = { "temperature": ["temperature"], "rain": ["va y avoir de la pluie", "qu'il va pleuvoir", "qu'il pleut"] };
    others = { "useless": ["est-il", "fait-il", "fera-t-il"] };

    public execute(context: KeywordWithTimeContext, next: (error?: any) => void, callback: (answer: string) => void)
    {
        switch (context.keyword)
        {
            case 'temperature':
            case 'rain':
                var dayOffset = (context.time && Sugar.Date.isValid(context.time) ? Sugar.Date.daysFromNow(context.time) + 1 : 0);
                var self = this;
                this.weather.forecast().then(function (data)
                {
                    var forecast;
                    if (!isNaN(data) || !data || !data.forecast || !data.forecast.simpleforecast || !data.forecast.simpleforecast)
                    {
                        next(self.translate('connection issue'));
                        return;
                    }
                    else if (typeof (dayOffset) != 'undefined')
                        forecast = data.forecast.simpleforecast.forecastday[dayOffset];
                    else
                        forecast = data.forecast.simpleforecast.forecastday;
                    switch (context.keyword)
                    {
                        case 'temperature':
                            if (context.time && Sugar.Date.isFuture(context.time))
                                callback(self.translate('il va faire entre {0}° et {1}°', forecast.low.celsius, forecast.high.celsius));
                            else
                                callback(self.translate('il fait entre {0}° et {1}°', forecast.low.celsius, forecast.high.celsius));
                            break;
                        case 'rain':
                            if (context.action == 'is')
                            {

                            }
                            break;
                    }
                }, function (error) { next(error); });
                break;
        }
    }

    public understand(context: KeywordWithTimeContext)
    {
        super.understand(context);
        if (context.keyword)
            context.deferred = false;
    };
}



di.injectWithName(['weather', 'translator'], function (weather: Weather, translator: Translator)
{
    new WeatherInterpreter(weather, translator).register();
})();