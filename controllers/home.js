var api=require('./api/home.js');


module.exports={
	index:function(){
		var self=this;
		api.get(function(current){
			api.forecast(undefined, function(forecast){
				return self.view({now:current.current_observation, forecast:forecast[0], forecasts:forecast});	
			});
		});
	},
	icon:function(){
		var self=this;
		api.get(function(data){
			if(!isNaN(data))
				return self.send(data);
			return self.redirect(data.current_observation.icon_url);
		});
	},
	background:function(){
		var self=this;
		var backdropFileName = "default.jpg";
		api.get(function(data){
			if(!isNaN(data))
				return self.send(data);
			var condition=data.current_observation.icon;
			console.log(condition);
			switch(condition.toLowerCase())
			{
				case 'partlycloudy':
				case 'cloudy':
					backdropFileName = "clouds.jpg";
					break;
				case 'mist':
					backdropFileName = "misty.jpg";
					break;
				case 'clear':
					backdropFileName = "clear.jpg";
					break;
				case 'sunny':
					backdropFileName = "sunny.jpg";
					break;
				case 'rain':
					backdropFileName = "rainy.jpg";
					break;
				case 'snow':
					backdropFileName = "snowy.jpg";
					break;
				case 'storm':
					backdropFileName = "stormy.jpg";
					break;
			}
			self.asset('img/'+backdropFileName);
		});
	}
}
