///<reference path="../typings/node/node.d.ts" />                   //refence node declaration file for intellisense and type safety
var http = require('http'); //import core module of node in javascript style 
var fs = require('fs');
var HttpTS = (function () {
    function HttpTS(port) {
        this._port = port || 3000;
        this._routes = [];
    }
    HttpTS.prototype.errorFile = function (path) {
        this._errorFile = path;
    };
    HttpTS.prototype.start = function () {
        this._server = http.createServer().listen(3000); //server started
        console.log('Server running at http://localhost:3000/');
        var _self = this; //block level scope variable for server
        this._server.on('request', function (req, res) {
            //handle routes
            if (req.url.search('/public') == 0) {
                console.log('found static');
            }
            for (var i = 0; i < _self._routes.length; i++) {
                var route = _self._routes[i];
                if (route.url == req.url) {
                    if (route.type == 'text') {
                        _self._send(route.response, res); //send requested text
                    }
                    else {
                        _self._sendFile(route.response, route.type, res); //send required file
                    }
                    break;
                }
            }
            _self._errorHandler(res); //handle error if no route is available and server will not crash
        });
    };
    //to get routes
    HttpTS.prototype.route = function (url, type, response) {
        this._routes.push({ url: url, type: type, response: response });
    };
    //to handle errors
    HttpTS.prototype._errorHandler = function (res, err) {
        if (err) {
            console.log(err.toString());
        }
        var _self = this;
        this._readFile(this._errorFile, function (err, data) {
            res.writeHead(404, _self._mime('html'));
            res.end(data.toString());
        });
    };
    HttpTS.prototype._mime = function (type) {
        switch (type) {
            case 'text':
                return { 'Content-Type': 'text/plain' };
                break;
            case 'html':
                return { 'Content-Type': 'text/html' };
                break;
            case 'css':
                return { 'Content-Type': 'text/css' };
                break;
            case 'js':
                return { 'Content-Type': 'text/js' };
                break;
            case 'png':
                return { 'Content-Type': 'image/png' };
                break;
            case 'jpg':
                return { 'Content-Type': 'image/jpg' };
                break;
            case 'gif':
                return { 'Content-Type': 'image/gif' };
                break;
            default:
                break;
                return { 'Content-Type': 'text/plain' };
        }
    };
    //to send text
    HttpTS.prototype._send = function (Text, res) {
        res.writeHead(200, this._mime('text'));
        res.end(Text);
    };
    //to read file
    HttpTS.prototype._readFile = function (path, cb) {
        fs.readFile(path, function (err, data) {
            cb(err, data);
        });
    };
    //to send file
    HttpTS.prototype._sendFile = function (path, type, res) {
        var _self = this;
        this._readFile(path, function (err, data) {
            if (err) {
                _self._errorHandler(res, err);
            }
            res.writeHead(200, _self._mime(type));
            res.end(data.toString());
        });
    };
    return HttpTS;
})();
exports.default = HttpTS;
