///<reference path="./typings/node/node.d.ts" />
var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile('./index.html', function (err, data) {
        if (err) {
            console.log(err.toString()); //Log the error on console
            res.end('404 - Not Found'); //Return not found response to client
            return;
        }
        res.end(data.toString());
    });
}).listen(3000);
console.log('Server running at http://localhost:3000/');
