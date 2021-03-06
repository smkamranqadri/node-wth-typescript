///<reference path="./typings/node/node.d.ts" />
var http = require('http');
var fs = require('fs'); //import fs core module of node to access files system 
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile('./index.html', function (err, data) {
        if (err)
            throw err; //if err comes then log on to console and server will be stoped
        res.end(data.toString()); //sending content to client by converting from butter to string
    });
}).listen(3000);
console.log('Server running at http://localhost:3000/');
