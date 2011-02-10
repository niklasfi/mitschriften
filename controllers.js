var http = require('http');

var noop = function(){};

var couchGet = function(path,callback){
	console.log(path);
	http.get({host: 'niklasfi.de', port: '5984', path: path},function(res){
		var sigma = "";
		res.setEncoding('utf8');
		res.on('data',function(chunk){sigma+=chunk});
		res.on('end',function(){callback(JSON.parse(sigma))});
	});
}

this.bulkRetrieve = function(ids,callback){
	var req = http.request({host: 'niklasfi.de', port: '5984', path: '/ms/_all_docs?include_docs=true', method: 'POST'}, function(res){
		var sigma = "";
		res.setEncoding('utf8');
		res.on('data',function(chunk){sigma+=chunk});
		res.on('end',function(){
			var lib={};
			var arr = JSON.parse(sigma).rows;
			for(var k in arr){
				if(arr[k].doc != undefined){
					lib[arr[k].key] = arr[k].doc;
				}
			}
			callback(lib)
		});
	});
	req.end(JSON.stringify({keys:ids}));
	
}

this.moduleList = function(callback){
	couchGet('/ms/_design/module/_view/overview',function(data){
		var o=[];
		for(var i in data.rows){
			o.push(data.rows[i].key);
		}
		callback(o);
	})
}

this.moduleByName = function(sname,modname,callback){
	couchGet('/ms/_design/module/_view/detail?key='+encodeURI(JSON.stringify([sname,modname])),function(data){
		if(data && data.rows && data.rows[0])
			callback(data.rows[0].value)
		else
			callback(null);	
	});
}
