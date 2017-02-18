"use strict";
var di = require("akala-core");
di.injectWithName(['$router'], function (router) {
    router.get('/api', di.command(['$callback', 'weather'], function (callback, weather) {
        return weather.getInfo();
    }));
    router.get('/api/temperature', di.command(['$callback', 'weather'], function (callback, weather) {
        return weather.getInfo().then(function (data) {
            callback({ celsius: data.current_observation.temp_c, fahrenheit: data.current_observation.temp_f });
        });
    }));
    router.get('/api/forecast/:dayOffset', di.command(['params.dayOffset', '$callback', 'weather'], function (dayOffset, callback, weather) {
        weather.forecast().then(function (data) {
            if (!isNaN(data) || !data || !data.forecast || !data.forecast.simpleforecast || !data.forecast.simpleforecast)
                callback(data);
            else if (typeof (dayOffset) != 'undefined')
                callback(data.forecast.simpleforecast.forecastday[dayOffset]);
            else
                callback(data.forecast.simpleforecast.forecastday);
        });
    }));
})();

//# sourceMappingURL=get.js.map
