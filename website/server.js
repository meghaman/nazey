var express = require("express");
var app = express();
var fs = require("fs");

app.get('/', function (req, res) {
	fs.readFile('./index.html', function(err, data) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(data);
	});
});
app.use('/resume', express.static(__dirname + '/resume'));
app.use('/assets', express.static(__dirname + '/assets'));
app.listen(8080);
