///<reference path="./typings/node/node.d.ts" />

import http = require('http')
import fs   = require('fs')

class HttpServer {

  private _server : http.Server
  private _port   : number
  
  constructor (port? : number){
    this._port = port || 3000
    this._server = http.createServer().listen(this._port);
    console.log('Server running at http://localhost:3000/');
  }
  
  send (url : string, Text : string) {
    this._server.on('request', function(req : http.ServerRequest, res : http.ServerResponse){
      if (req.url === url) {
        res.end(Text);
      } else if (url === '*') {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('404 - Not Found');
        return;
      }
    })
  }
  
  sendFile (url : string, path : string) {
    this._server.on('request', function(req : http.ServerRequest, res : http.ServerResponse){
      if (req.url === url) {
        fs.readFile(path, function(err : Error, data : Buffer) {
          // this._errorHandle(err,res);
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(data.toString);
        })
      }
    })
  }

}

let testServer : HttpServer = new HttpServer();

testServer.send('/me', 'Hello World! Me');
testServer.sendFile('/home', 'index.html');
testServer.send('*', 'Hello World');