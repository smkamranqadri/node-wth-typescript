///<reference path="./typings/node/node.d.ts" />
//import HttpTS from 'lib/HttpTS';
var http = require('http');
var fs = require('fs');
var HttpTS = (function () {
    function HttpTS(port) {
        this._port = port || 3000;
        this._routes = [];
    }
    HttpTS.prototype.start = function () {
        this._server = http.createServer().listen(3000);
        console.log('Server running at http://localhost:3000/');
        this._server.on('request', function (req, res) {
            //handle routes
            console.log(req.url);
            for (var i = 0; i < this._routes.length; i++) {
                var route = this._routes[i];
                console.log(route);
                if (route.url == req.url) {
                    console.log('FOUND URL');
                    if (route.type == 'text') {
                        console.log('FOUND TEXT');
                        this._send(route.response, res);
                    }
                    else if (route.type == 'html') {
                        console.log('FOUND FILE');
                        this._sendFile(route.response, res);
                    }
                    break;
                }
            }
            this._errorHandler(res);
        });
    };
    HttpTS.prototype.route = function (url, type, response) {
        this._routes.push({ url: url, type: type, response: response });
    };
    HttpTS.prototype._errorHandler = function (res, err) {
        if (err) {
            console.log(err.toString);
        }
        res.writeHead(404, { 'Content-Type': 'text/html' });
        this._sendFile('../html/error.html', res);
        return;
    };
    HttpTS.prototype._Send = function (Text, res) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(Text);
    };
    HttpTS.prototype._sendFile = function (path, res) {
        fs.readFile(path, function (err, data) {
            if (err) {
                this._errorHandler(res, err);
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data.toString);
        });
    };
    return HttpTS;
})();
var server = new HttpTS();
server.route('/', 'text', 'Hello World');
server.route('/home', 'html', 'index.html');
server.start();
