
var baseCachePath='./modules/weather/cache/';


var getFromCache=function(method, callback)
{
	var cacheData= function(data)
		{
            $('fs').exists(baseCachePath, function(exists){
                if(!exists)
                    $('fs').mkdirSync(baseCachePath);
                $('fs').writeFile(fileName, JSON.stringify(data), function(err){
                    if(err)
                        console.log(err);
                    callback(data);
                });
            })
		};
	var position=$.settings('position');
	if(!position)
		return callback(400);
	var fileName=baseCachePath+method+'-'+position.latitude+','+position.longitude+'.json';
	var url='http://api.wunderground.com/api/eff76d6447a195e1/geolookup/'+method+'/lang:FR/q/'+position.latitude+','+position.longitude+'.json';
	$('fs').exists(fileName, function(exists){
		if(exists)
		{
			$('fs').stat(fileName, function(err, stats){
				console.log(stats.mtime);
				if((new Date()-stats.mtime)/60000<15)
				{
					$('fs').readFile(fileName, function(err, data){
						if(err)
							$.getJSON(url, cacheData);
						callback(JSON.parse(data));
					})
				}
				else
					$.getJSON(url, cacheData);

			})
		}
		else
			$.getJSON(url, cacheData);

	});
}

var getInfo=function(callback)
{
	getFromCache('conditions', callback);
};

var forecast=function(callback)
{
	getFromCache('forecast', callback);
};


module.exports={
	get:function(callback){
		getInfo(callback);
	},
	temperature:function(callback){
		getInfo(function(data){
			callback({celsius:data.current_observation.temp_c, fahrenheit:data.current_observation.temp_f});
		});
	},
	forecast:function(id, callback){
		forecast(function(data){
			if(!isNaN(data))
				callback(data);
			else if(typeof(id)!='undefined')
				callback(data.forecast.simpleforecast.forecastday[id])
			else
				callback(data.forecast.simpleforecast.forecastday);
		});
	}
}
