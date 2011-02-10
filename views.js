this.module = function(req,res,moduleData,moduleList,files){
	res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
	res.write('<!DOCTYPE html><html lang="de"><head><title>Modul: ' + moduleData.name +'</title><meta charset=utf-8 /></head><body>\n\n<h1>' + moduleData.name + '</h1>\n<div>\n\t<p>verfügbare Module:</p>\n\t<ul class="modulliste">')

	var part = "";
	var s = null;
	for (var i in moduleList){
		if(s!=moduleList[i][0]){
			if(s != null) part += '\n\t\t\t</ul>\n\t\t</li>'
			part += '\n\t\t<li class="semester">' + moduleList[i][0] + "\n\t\t\t<ul>"
			s=moduleList[i][0];
		}

		part+='\n\t\t\t\t<li class="modul">'+moduleList[i][1]+'</li>'
	}
	
	res.write(part+'\n\t\t\t</ul>\n\t\t</li>\n\t</ul>\n</div>\n<p>Dokumente zu diesem Modul</p>')
	
	part = "\n<div>\n\t<ul>";
	
	for (var ename in moduleData.events){
		part += '\n\t\t<li>'+ename+'\n\t\t\t<ul>';
		for(var date in moduleData.events[ename]){
			part+='\n\t\t\t\t<li>'+date
			if(moduleData.events[ename][date].length>0){
				var dArr = moduleData.events[ename][date];
				part+='\n\t\t\t\t\t<ul>'
				for(var i in dArr)
					part+='\n\t\t\t\t\t\t<li><a href="/users/' + encodeURI(files[dArr[i]].author) +'">' +files[dArr[i]].author + '</a>, <a href="/download/'+encodeURI(dArr[i])+'">download</a>s: '+ files[dArr[i]].downloads;
				part+='\n\t\t\t\t\t</ul>'
			}
			part+='</li>';
		}
		part += '\n\t\t\t</ul>\n\t\t</li>'
	}
	
	res.write(part+'\n\t</ul>\n</div></body></html>')
	res.end();
}

this.send404 = function(req,res){
	console.log('404: ' + req.url);
	res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
	res.end('file not found. we cannot satisfy your request');
}
