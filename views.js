this.module = function(req,res,moduleData,moduleList,files){
	res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
	res.write('<!DOCTYPE html><html lang="de"><head><title>' + (moduleData ?('Modul:' + moduleData.name) : 'Module im Überblick')+
		'</title><meta charset=utf-8 /><link rel="stylesheet" type="text/css" href="/static/style.css"></head><body>\n\n<div id="container"><h1>' 
		+ (moduleData?moduleData.name: 'Module im Überblick') + '</h1>\n\t<h3>Übersicht</h3>\n\t<ul class="modulliste">')

	var part = "";
	var s = null;
	for (var i in moduleList){
		if(s!=moduleList[i][0]){
			part += '\n\t\t<li class="semester"><span class="semestername">' + moduleList[i][0] + '</span>'
			s=moduleList[i][0];
		}

		part+='\n\t\t\t\t<a href="/module/'+encodeURI(moduleList[i][0])+'/'+encodeURI(moduleList[i][1])+'">'+moduleList[i][1]+'</a>'
	}
	
	res.write(part+'\n\t\t</li>\n\t</ul>\n</div>')
	if(moduleData){
		part = "\n<h3>Dokumente</h3>\n<div>\n\t<ul>";
	
		for (var ename in moduleData.events){
			part += '\n\t\t<li>'+ename+'\n\t\t\t<ul>';
			for(var date in moduleData.events[ename]){
				part+='\n\t\t\t\t<li>'+date
				if(moduleData.events[ename][date].length>0){
					var dArr = moduleData.events[ename][date];

					part+='\n\t\t\t\t\t<ul>'
					for(var i in dArr){
						part+='\n\t\t\t\t\t\t<li><a href="/users/' +  encodeURI(files[dArr[i]].author) +'">' +files[dArr[i]].author + '</a>, <a href="/download/'+encodeURI(dArr[i])+'">download</a>s: '+ files[dArr[i]].downloads;
					}
					part+='\n\t\t\t\t\t</ul>'
				}
				part+='</li>';
			}
			part += '\n\t\t\t</ul>\n\t\t</li>'
		}
		res.write(part+'\n\t</ul>\n</div>')
	}
	res.write('</div><div id="right"><h3>Springen</h3><ul><li>Vorlesung</li><li>Kleingruppenübung</li><li>Globalübung</li></ul><h3>Aktionen</h3><ul><li>Modul erstellen</li></ul></div><div></body></html>')
	res.end();
}

this.send404 = function(req,res){
	console.log('404: ' + req.url);
	res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
	res.end('file not found. we cannot satisfy your request');
}
