import * as di from 'akala-core';
import * as express from 'express';
import { Settings } from '../../../settings';
import * as fs from 'fs';

var baseCachePath = './modules/weather/cache/';

@di.service('weather', '$http', 'settings')
export class Weather
{
    constructor(private http: di.Http, private settings: Settings)
    {

    }

    private getFromCache(method: string): PromiseLike<any>
    {
        var defer = new di.Deferred<any>();
        var cacheData = function (data)
        {
            fs.exists(baseCachePath, function (exists)
            {
                if (!exists)
                    fs.mkdirSync(baseCachePath);
                fs.writeFile(fileName, JSON.stringify(data), function (err)
                {
                    if (err)
                        defer.reject(err);
                    else
                        defer.resolve(data);
                });
            })
        };
        var position = this.settings('position');
        if (!position)
        {
            setImmediate(function ()
            {
                console.log('invalid position');
                defer.reject('invalid position')
            });
            return defer;
        }
        var fileName = baseCachePath + method + '-' + position.latitude + ',' + position.longitude + '.json';
        var url = 'http://api.wunderground.com/api/eff76d6447a195e1/geolookup/' + method + '/lang:FR/q/' + position.latitude + ',' + position.longitude + '.json';
        var self = this;
        fs.exists(fileName, function (exists)
        {
            if (exists)
            {
                fs.stat(fileName, function (err, stats)
                {
                    console.log(stats.mtime);
                    if ((new Date().valueOf() - stats.mtime.valueOf()) / 60000 < 15)
                    {
                        fs.readFile(fileName, function (err, data)
                        {
                            if (err)
                                self.http.getJSON(url).then(cacheData, function (error)
                                {
                                    defer.reject(error);
                                });
                            try
                            {
                                defer.resolve(JSON.parse(data.toString()));
                            }
                            catch (e)
                            {
                                self.http.getJSON(url).then(cacheData, function (error)
                                {
                                    defer.reject(error);
                                })
                            }
                        })
                    }
                    else
                        self.http.getJSON(url).then(cacheData, function (error)
                        {
                            defer.reject(error);
                        })

                })
            }
            else
                self.http.getJSON(url).then(cacheData, function (error)
                {
                    defer.reject(error);
                })

        });

        return defer;
    }


    public getInfo()
    {
        return this.getFromCache('conditions');
    };

    public forecast()
    {
        return this.getFromCache('forecast');
    };
}