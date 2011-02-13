var formidable = require('formidable'),
    http = require('http'),
    sys = require('sys'),
    fs = require('fs'),
    url = require('url');

var config = require('./config.js');

var m = require('./models.js');
var v = require('./views.js');
var c = require('./controllers.js');

http.createServer(function(req, res){
	res.ctime=Date.now();
	req.parsedUrl = url.parse(req.url);
	var path = decodeURI(req.parsedUrl.pathname);
	var matches;
	if( matches = path.match(/^.*[^/]$/) ){
		v.redirect(req,res,matches[0]+'/',true);
	}
	else if( matches = path.match(/^\/module(\/(([^\/]+)\/([^\/]+)\/?)?)?$/i ) ){
		c.module(req,res,matches);
	}
	else if( matches = path.match(/^\/upload\/([^\/]+)\/([^\/]+)(\/(([^\/]+)\/([^\/]+)\/?)?)?$/i)){
		c.upload(req,res,matches);
	}
	else{
		v.send404(req,res);
	}
	
}).listen(config.port);
console.log('server running on port ' + config.port);

