this.module = function(req,res,moduleData,moduleList,files){
	res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
	res.write('<!DOCTYPE html><html lang="de"><head><title>' + (moduleData ?('Modul: ' + moduleData.name) : 'Module im Überblick')+
		'</title><meta charset=utf-8 />'
			+ '<link type="text/css" rel="stylesheet" href="/static/css/style.css">'
			+ '<link type="image/vnd.microsoft.icon" rel="icon" href="/favicon.ico" >'
			+ '<script type="text/javascript" src="/static/js/jquery-1.5.min.js"></script>'
			+ '<script type="text/javascript" src="/static/js/jquery.colorbox-min.js"></script>'
			+ '<script type="text/javascript" src="/static/js/script.js"></script>'
			+ '<link media="screen" rel="stylesheet" href="/static/colorbox/colorbox.css" />'
			+ '</head><body>\n\n<div id="container"><h1>' + (moduleData?moduleData.name: 'Module im Überblick') + '</h1>\n\t<h3>Übersicht</h3>\n\t<table class="separation">')

	var part = "";
	var s = null;
	
	for (var i in moduleList){
		var currS = moduleList[i].key[1];
		var currM = moduleList[i].value;
		if(s!=moduleList[i].key){
			if(s!=null) part += '</td></tr>';
			part += '\n\t\t<tr><td class="header">' + currS + '</td><td class="items">'
			s=currS
		}

		part+='<div class="item"><a href="/module/'+encodeURI(currS)+'/'+encodeURI(currM)+'">'+currM+'</a></div>'
	}
	
	res.write(part+'</td></tr></table>')
	part="";
	if(moduleData){
		for (var ename in moduleData.events){
			part += '<h3><a name="' + ename + '">'+ename+'</a></h3><table class="separation">';
			for(var date in moduleData.events[ename]){
				part+='<tr class="items"><td class="header">' + date + '</td><td>'
				if(moduleData.events[ename][date].length>0){
					var dArr = moduleData.events[ename][date];

					part+=''
					for(var i in dArr){
						if(files[dArr[i]]){
							part+='<div class="item"><a href="/users/' +  encodeURI(files[dArr[i]].author) +'">' +files[dArr[i]].author + '</a>, <a href="/download/'+encodeURI(dArr[i])
								+'">dls: '+ files[dArr[i]].downloads + '</a><a href="/remove"><img class="remove" src="/static/images/modifier_remove.gif"></a></div>';
						}
					}
				}
				part+='<div class="icons"><a class="add" href="/upload/' + encodeURI(moduleData.term+moduleData.year) + '/' + encodeURI(moduleData.name)
				 + '/' + encodeURI(ename) + '/' + encodeURI(date) + '/'
				 + '"><img src="/static/images/symbol_addition.gif"></a></div></td></tr>';
			}
			part += '</table>'
		}
	}
		
	part+='<span class="time">It took ' + JSON.stringify(Date.now()-res.ctime) + 'ms to render this page</span></div><div id="right">'
	if(moduleData){
		part += '<h3>Springen</h3><ul>'
		for(var ename in moduleData.events){
			part+='<li><a href="#' + ename + '">'+ename+'</a></li>';
		}
		part += '</ul>'
	}
	part+= '<h3>Aktionen</h3><ul>'
			+ '<li>Modul erstellen</li>'
			+	'</ul>'
			+ '</div></body></html>'
	res.end(part);
}

this.uploadForm = function(req,res,mData,ename,date,inline){
	res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'})
	var part = ''
	if (!inline){
		part+= '<!DOCTYPE html><html lang="de"><head><title>Upload</title>'
			+'<link type="text/css" rel="stylesheet" href="/static/css/style.css">'
			+ '</head><body>';
	}
	part+= '<h3>Datei hochladen</h3><p>Du möchtest also etwas zu <span class="emph">'+mData.name+'</span> aus dem <span class="emph">'+mData.semester+'</span> hochladen.</p><form method="POST">'
	+ '	<p><label>Wozu gehört dein Dokument?</label><br>'
	+ ' Suche hier: (benötigt HTML5)<br>'
	+ '   <input list="instance" name="instance" value="' + (ename && date?(ename +' - '+ date):'') + '" size="30">'
	+ '	<datalist id="instance"><label>oder wähle einen Eintrag aus der Liste<select name="breed">'
	for(var ename in mData.events){
		for(var inst in mData.events[ename])
			part += '<option value="' + ename + ' - ' + inst +'">' + ename + ' - ' + inst + '</option>';
	}
	part += '</select></label></datalist></p>'
	+ ' <p><label>Welche Datei möchtest du hochladen?</label><br><input type="file"></p>'
	+ ' <p><label>Abschicken?</label><br><button type="submit">Abschicken!</button></p>'
	+ '</form>'
	if (!inline)
		part+= '</body></html>'
	res.end(part);
}

this.send404 = function(req,res){
	console.log('404: ' + req.url);
	res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
	res.end('file not found. we cannot satisfy your request');
}

this.redirect = function(req,res,location,permanent){
	res.writeHead(permanent?301:302,{'Location': location})
	res.end('Moved!');
}
