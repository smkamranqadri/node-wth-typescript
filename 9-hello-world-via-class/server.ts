///<reference path="./typings/node/node.d.ts" />

//import HttpTS from 'lib/HttpTS';

import http = require('http')
import fs   = require('fs')

interface Iroute {
  url : string, 
  type : string, 
  response : string
}

class HttpTS {

  private _server : http.Server
  private _port   : number
  private _routes : Array<Iroute>
  
  constructor (port? : number){
    this._port = port || 3000;
	  this._routes = [];
  }
  
  start () {
    this._server = http.createServer().listen(3000);
    console.log('Server running at http://localhost:3000/');
    this._server.on('request', function(req : http.ServerRequest, res : http.ServerResponse){
      //handle routes
	  console.log(req.url);
      for (let i = 0; i < this._routes.length; i++) {                                         //not able us this
        let route : Iroute = this._routes[i];                        
		console.log(route);
        if (route.url == req.url) {
			console.log('FOUND URL');
          if (route.type == 'text') {
			  console.log('FOUND TEXT');
              this._send(route.response, res)
          } else if (route.type == 'html') {
			  console.log('FOUND FILE');
              this._sendFile(route.response, res)
          }
          break;
        }
      }
      this._errorHandler(res)
    })
  }
  
  route (url : string, type : string, response : string) {
    this._routes.push({url, type, response});
  }
  
  private _errorHandler (res : http.ServerResponse, err? : Error) {
    if (err) {console.log(err.toString)}
    res.writeHead(404, { 'Content-Type': 'text/html' });
    this._sendFile('../html/error.html', res);
    return;
  }
  
  private _Send (Text : string, res : http.ServerResponse) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(Text);
  }
  
  private _sendFile (path : string, res : http.ServerResponse) {
    fs.readFile(path, function(err : Error, data : Buffer) {
      if (err) {
        this._errorHandler(res,err)
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data.toString);
    })
  }

}

let server : HttpTS = new HttpTS();
server.route ('/', 'text', 'Hello World');
server.route ('/home', 'html', 'index.html');
server.start()