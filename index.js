exports.init=function(config, app)
{
	if(!$.settings('position'))
		$.settings('position', '');
	$.device({ category:'sensor', type:'sensor', name:'meteo', subdevices:[
	    {
	        name:'temperature',
	        category:'sensor',
	        type:'sensor',
	        statusMethod:15*60*1000,
	        status:function(callback){
                require('./controllers/api/home.js').temperature(callback);
	        }
        }
        ]
	});
}