var formidable = require('formidable'),
    http = require('http'),
    sys = require('sys'),
    fs = require('fs'),
    url = require('url');

var config = require('./config.js');

var c = require('./controllers.js');
var v = require('./views.js');

http.createServer(function(req, res) {
	var path = decodeURI(url.parse(req.url).pathname);
	var matches;
	if( matches = path.match(/^\/module(\/([^\/]+)\/([^\/]+\/?))?$/i ) ){
		var sname = matches[2]
		var modname = matches[3];
		var list, m, files;
		if(modname)
			c.moduleByName(sname,modname,function(data){
				if(data === null) v.send404(req,res);
				else{
					m = data;
					var ids=[];
					for(var ename in m.events)
						for(var date in m.events[ename])
							for(var k in m.events[ename][date])
								ids.push(m.events[ename][date][k]);
				
					c.bulkRetrieve(ids,function(data){
						if(list) v.module(req,res,m,list,data);
						else files = data;
					})
				}
			})
		c.moduleList(function(data){
			if(!modname || files) v.module(req,res,mod,data,files);
			else list = data;
		})
	}
	else{
		v.send404(req,res);
	}
	
}).listen(config.port);


