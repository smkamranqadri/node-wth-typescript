///<reference path="./typings/node/node.d.ts" />
var http = require('http');
var fs = require('fs');
var HttpServer = (function () {
    function HttpServer(port) {
        this._port = port || 3000;
        this._server = http.createServer().listen(this._port);
        console.log('Server running at http://localhost:3000/');
    }
    HttpServer.prototype.send = function (url, Text) {
        this._server.on('request', function (req, res) {
            if (req.url === url) {
                res.end(Text);
            }
            else if (url === '*') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 - Not Found');
                return;
            }
        });
    };
    HttpServer.prototype.sendFile = function (url, path) {
        this._server.on('request', function (req, res) {
            if (req.url === url) {
                fs.readFile(path, function (err, data) {
                    // this._errorHandle(err,res);
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data.toString);
                });
            }
        });
    };
    return HttpServer;
})();
var testServer = new HttpServer();
testServer.send('/me', 'Hello World! Me');
testServer.sendFile('/home', 'index.html');
testServer.send('*', 'Hello World');
