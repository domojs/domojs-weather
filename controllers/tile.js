var api=require('./api/home.js');


module.exports={
	index:function(callback){
		api.get(function(current){
			if(!isNaN(current))
				return callback(current);
			api.forecast(1, function(forecast){
				if(!isNaN(forecast))
					return callback(forecast);
				callback({
					url:'#weather',
					subBlocks:[
						{background:'/assets/weather/img/'+current.current_observation.icon+'.svg', size:128, refresh:'parent', interval:3600},
						{text:current.current_observation.temp_c+'<sup>°C</sup>', size:128},
						{text:'Aujourd\'hui', size:128},
						],
						back:{background:'/weather/background', subBlocks:[
							{background:'/assets/weather/img/'+forecast.icon+'.svg', size:128, refresh:'parent', interval:3600},
							{text:forecast.low.celsius+'<sup>°C</sup>', size:128},
							{text:forecast.date.weekday, size:128 },
							{text:forecast.high.celsius+'<sup>°C</sup>', size:128},
							]}});
				});
		});
	},
}
