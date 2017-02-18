"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var di = require("akala-core");
var fs = require("fs");
var baseCachePath = './modules/weather/cache/';
var Weather = (function () {
    function Weather(http, settings) {
        this.http = http;
        this.settings = settings;
    }
    Weather.prototype.getFromCache = function (method) {
        var defer = new di.Deferred();
        var cacheData = function (data) {
            fs.exists(baseCachePath, function (exists) {
                if (!exists)
                    fs.mkdirSync(baseCachePath);
                fs.writeFile(fileName, JSON.stringify(data), function (err) {
                    if (err)
                        defer.reject(err);
                    else
                        defer.resolve(data);
                });
            });
        };
        var position = this.settings('position');
        if (!position) {
            setImmediate(function () {
                console.log('invalid position');
                defer.reject('invalid position');
            });
            return defer;
        }
        var fileName = baseCachePath + method + '-' + position.latitude + ',' + position.longitude + '.json';
        var url = 'http://api.wunderground.com/api/eff76d6447a195e1/geolookup/' + method + '/lang:FR/q/' + position.latitude + ',' + position.longitude + '.json';
        var self = this;
        fs.exists(fileName, function (exists) {
            if (exists) {
                fs.stat(fileName, function (err, stats) {
                    console.log(stats.mtime);
                    if ((new Date().valueOf() - stats.mtime.valueOf()) / 60000 < 15) {
                        fs.readFile(fileName, function (err, data) {
                            if (err)
                                self.http.getJSON(url).then(cacheData, function (error) {
                                    defer.reject(error);
                                });
                            try {
                                defer.resolve(JSON.parse(data.toString()));
                            }
                            catch (e) {
                                self.http.getJSON(url).then(cacheData, function (error) {
                                    defer.reject(error);
                                });
                            }
                        });
                    }
                    else
                        self.http.getJSON(url).then(cacheData, function (error) {
                            defer.reject(error);
                        });
                });
            }
            else
                self.http.getJSON(url).then(cacheData, function (error) {
                    defer.reject(error);
                });
        });
        return defer;
    };
    Weather.prototype.getInfo = function () {
        return this.getFromCache('conditions');
    };
    ;
    Weather.prototype.forecast = function () {
        return this.getFromCache('forecast');
    };
    ;
    return Weather;
}());
Weather = __decorate([
    di.service('weather', '$http', 'settings')
], Weather);
exports.Weather = Weather;

//# sourceMappingURL=service.js.map
