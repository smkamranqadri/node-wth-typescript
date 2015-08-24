///<reference path="./typings/node/node.d.ts" />                                    //referencing declaration file of node for getting intellisense and compilation error
var http = require('http'); //importing http core module of node
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' }); //writing header on response object to know client brower what status and type of data is sending
    res.end('Hello World\n'); //writing response to client                               
}).listen(3000, '127.0.0.1'); //setting listening port and start listening request
console.log('Server running at http://127.0.0.1:3000/'); //logging on console when server starts running
