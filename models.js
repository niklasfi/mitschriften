var http = require('http');

var noop = function(){};

var couchGet = function(path,callback){
	var req = http.request({host: '127.0.0.1', port: '5984', path: path, method: 'GET'},function(res){
		console.log(path + ' (' + (Date.now()-req.ctime) + 'ms)');
		var sigma = "";
		res.setEncoding('utf8');
		res.on('data',function(chunk){sigma+=chunk});
		res.on('end',function(){callback(JSON.parse(sigma))});
	});
	req.end();
	req.ctime = Date.now();
}

this.bulkRetrieve = function(ids,callback){
	var req = http.request({host: '127.0.0.1', port: '5984', path: '/ms/_all_docs?include_docs=true', method: 'POST'}, function(res){
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

this.filesByModul = function(modulid,callback){
	couchGet('/ms/_design/files/_view/byModul?include_docs=true&key='+encodeURI(JSON.stringify(modulid)),function(data){
		//console.log(JSON.stringify(data));
		var lib = {};
		for(var i in data.rows){
			lib[data.rows[i].id] = data.rows[i].doc;
		}
		//console.log(JSON.stringify(lib));
		callback(lib);
	});
}

this.moduleList = function(callback){
	couchGet('/ms/_design/module/_view/nameBySemester',function(data){callback(data.rows)});
}

this.moduleByName = function(sname,modname,callback){
	couchGet('/ms/_design/module/_view/byName?include_docs=true&key='+encodeURI(JSON.stringify([sname,modname])),function(data){
		if(data && data.rows && data.rows[0])
			callback(data.rows[0].doc)
		else
			callback(null);	
	});
}
