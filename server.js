"strict mode";

var util = require('util'),
   http = require('http'),
   url = require('url');

function exit(errorstring, errornumber, showusage) {
	if (showusage) util.puts("Usage: nodejs server.js port servicesdomain\n");
	util.puts("Error: "+errorstring+"\n\n");
	process.exit(errornumber);
}

var port;
(function parseArgs() {
	port = parseInt(process.argv[2], 10);
	if (isNaN(port) || port <= 0) {
		exit("Port must be number greater than zero", 1, true);
	}
 })();
var token = 1234567,
	userid = 2;
start_server(port);

function start_server(port) {


	http.ServerResponse.prototype.sendError = function sendError(code, message, headers) {
		if (!headers) headers = {};
		if (!('Content-Type' in headers)) headers['Content-Type'] = 'text/html';
		this.writeHead(code, headers);
		if (headers['Content-Type'] == 'text/html') this.write('<br/><strong>Error:</strong> '+message);
		else this.write(message);
		this.end();
	};

	http.createServer(function (req, res) {
		var url_parts = url.parse(req.url, true);
		var path = url_parts.pathname;
		var params = url_parts.query;
		var redirect_url_parts;
		switch (path) {
			case "/authenticate":	
				redirect_url_parts = url.parse(params.redirect_uri, true);
				
				// .search overwrites .query which can cause problems if there's already a token param
				delete redirect_url_parts.search;
				redirect_url_parts.query.token = token;
				res.sendError(307, "Go back to service", {Location: url.format(redirect_url_parts)});
				break;
			case "/data":
					res.writeHead(200, {'Content-Type': "application/json"});
					res.write(JSON.stringify({id: userid, mockdata: true}));
					res.end();
				break;
			case "/whoami":
				res.writeHead(200, {'Content-Type': "application/json", "Access-Control-Allow-Origin": req.headers.origin, "Access-Control-Allow-Credentials": true, "Vary": "Access-Control-Allow-Origin"});
				res.write(JSON.stringify({agentid: userid}));
				res.end();
				break;
			default:
				res.sendError(404, 'File not found');
				break;
		}
	}).listen(port);
	util.puts('Mock Server running at http://127.0.0.1:'+port+'/');
}
