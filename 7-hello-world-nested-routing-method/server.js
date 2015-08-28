///<reference path="./typings/node/node.d.ts" />
//importing modules
var http = require('http');
var fs = require('fs');
//custom functions
function errorHandle(err, res) {
    if (err) {
        console.log(err.toString);
        res.end('404 - Not Found');
        return;
    }
}
function sendFile(path, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile(path, function (err, data) {
        errorHandle(err, res);
        res.end(data.toString());
    });
}
//creating server
http.createServer(function (req, res) {
    //setting routes
    switch (req.url) {
        case '/':
            sendFile('./index.html', res);
            break;
        case '/contact':
            if (req.method == 'GET') {
                sendFile('./contact.html', res);
            }
            else if (req.method == 'POST') {
                res.end('You will be contact soon...');
            }
            break;
        default:
            res.end('404 - Not Found');
            break;
    }
}).listen(3000);
console.log('Server running at http://localhost:3000/');
