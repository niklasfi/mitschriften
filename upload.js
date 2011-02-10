var formidable = require('formidable'),
    http = require('http'),
    sys = require('sys'),
    fs = require('fs');

http.createServer(function(req, res) {
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    // parse a file upload
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(sys.inspect({fields: fields, files: files}));
      for(var i in files){
      	console.log(files[i].name);
      	fs.rename(files[i].path, './uploads/' + files[i].name);
      }
    });
    return;
  }

  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end
    ( '<form action="/upload" enctype="multipart/form-data" method="post">'
    + '<input type="text" name="title"><br>'
    + '<input type="text" name="author"><br>'
    + '<input type="file" name="upload"><br>'
    + '<input type="submit" value="Upload">'
    + '</form>'
    );
}).listen(8081);
