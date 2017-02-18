"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var di = require("akala-core");
var Sugar = require("sugar");
var language_1 = require("../../../chat/dist/server/language");
require("./service");
var WeatherInterpreter = (function (_super) {
    __extends(WeatherInterpreter, _super);
    function WeatherInterpreter(weather, translate) {
        var _this = _super.call(this) || this;
        _this.weather = weather;
        _this.translate = translate;
        _this.actions = { "which": ["quel", "quelle"], "is": ["est-ce"] };
        _this.keywords = { "temperature": ["temperature"], "rain": ["va y avoir de la pluie", "qu'il va pleuvoir", "qu'il pleut"] };
        _this.others = { "useless": ["est-il", "fait-il", "fera-t-il"] };
        return _this;
    }
    WeatherInterpreter.prototype.execute = function (context, next, callback) {
        switch (context.keyword) {
            case 'temperature':
            case 'rain':
                var dayOffset = (context.time && Sugar.Date.isValid(context.time) ? Sugar.Date.daysFromNow(context.time) + 1 : 0);
                var self = this;
                this.weather.forecast().then(function (data) {
                    var forecast;
                    if (!isNaN(data) || !data || !data.forecast || !data.forecast.simpleforecast || !data.forecast.simpleforecast) {
                        next(self.translate('connection issue'));
                        return;
                    }
                    else if (typeof (dayOffset) != 'undefined')
                        forecast = data.forecast.simpleforecast.forecastday[dayOffset];
                    else
                        forecast = data.forecast.simpleforecast.forecastday;
                    switch (context.keyword) {
                        case 'temperature':
                            if (context.time && Sugar.Date.isFuture(context.time))
                                callback(self.translate('il va faire entre {0}° et {1}°', forecast.low.celsius, forecast.high.celsius));
                            else
                                callback(self.translate('il fait entre {0}° et {1}°', forecast.low.celsius, forecast.high.celsius));
                            break;
                        case 'rain':
                            if (context.action == 'is') {
                            }
                            break;
                    }
                }, function (error) { next(error); });
                break;
        }
    };
    WeatherInterpreter.prototype.understand = function (context) {
        _super.prototype.understand.call(this, context);
        if (context.keyword)
            context.deferred = false;
    };
    ;
    return WeatherInterpreter;
}(language_1.KeywordInterpreter));
exports.WeatherInterpreter = WeatherInterpreter;
di.injectWithName(['weather', 'translator'], function (weather, translator) {
    new WeatherInterpreter(weather, translator).register();
})();

//# sourceMappingURL=interpreter.js.map
