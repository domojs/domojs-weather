exports.init=function(config, app)
{
	if(!$.settings('position'))
		$.settings('position', '');
	$.device({ category:'sensor', type:'sensor', name:'weather', commands:
	{
		value:'/api/weather/temperature',
		tile:'/weather/icon',
	}
	});
}