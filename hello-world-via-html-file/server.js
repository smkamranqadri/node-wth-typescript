///<reference path="./typings/node/node.d.ts" />
var http = require('http');
var fs = require('fs'); //import fs core module of node to access files system 
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile('./index.html', function (err, data) {
        if (err)
            throw err;
        res.end(data.toString());
    });
}).listen(3000);
console.log('Server running at http://localhost:3000/');
