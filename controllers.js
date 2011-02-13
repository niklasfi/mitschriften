var m = require('./models.js');
var v = require('./views.js');

this.module = function(req,res,matches){
	var sname = matches[3]
	var modname = matches[4];
	var list, mod, files;
	
	if(modname)
		m.moduleByName(sname,modname,function(data){
			if(data === null) v.send404(req,res);
			else{
				mod = data;
						
				m.filesByModul(mod._id,function(data){
					if(list){
	//							console.log('1'+JSON.stringify([m,list,data]));
						v.module(req,res,mod,list,data);
					}
					else files = data;
				})
			}
		})
	m.moduleList(function(data){
		if(!modname || files){
			 v.module(req,res,mod,data,files);
		}
		else list = data;
	})
}

this.upload= function(req,res,matches){
	var sname = matches[1];
	var modname = matches[2];
	var ename = matches[5];
	var date = matches[6];
	var inline = (req.parsedUrl.query=="inline")
	
	if(modname)
		m.moduleByName(sname,modname,function(data){
			if (data)	v.uploadForm(req,res,data,ename,date,inline);
			else v.send404(req,res);
		})
	else
		v.send404(req,res);
}
