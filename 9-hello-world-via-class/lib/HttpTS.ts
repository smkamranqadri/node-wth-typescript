///<reference path="../typings/node/node.d.ts" />                   //refence node declaration file for intellisense and type safety

import http = require('http')                                       //import core module of node in javascript style 
import fs   = require('fs')

interface Iroute {                                                  //created inerface to make type saftey for route object
  url      : string, 
  type     : string, 
  response : string
}

class HttpTS {                                                      //class for creating server

  private _server    : http.Server;                                 //private variable declaration
  private _port      : number;                                
  private _routes    : Array<Iroute>;
  private _errorFile : string;
  
  constructor (port? : number) {                                    //to get the port for starting server and intializing the array for routes
    this._port = port || 3000;
	  this._routes = [];
  }
   
  errorFile (path : string) : void {                                //to get error file path
    this._errorFile = path;
  }
  
  start () : void {                                                 //to start the server
    
    this._server = http.createServer().listen(3000);                //server started
    console.log('Server running at http://localhost:3000/');  
    
    let _self : HttpTS = this                                       //block level scope variable for server
    
    this._server.on('request', function(req : http.ServerRequest, res : http.ServerResponse){
      
      //handle routes
      
      if (req.url.search('/public') == 0) {
        _self._sendFile(req.url,res)
      }
      
      for (let i = 0; i < _self._routes.length; i++) {              //looping to check the requested route                   
        let route : Iroute = _self._routes[i];                        
        if (route.url == req.url) {
          if (route.type == 'text') {
            _self._send(route.response, res)                        //send requested text
          } else {
            _self._sendFile(route.response, res)                    //send required file
          }
          break;
        }
      }
      
      _self._errorHandler(res)                                     //handle error if no route is available and server will not crash
      
    })
    
  }
                                                                   //to get routes
  route (url : string, type : string, response : string) : void { 
    this._routes.push({url, type, response});
  }
                                                                   //to handle errors
  private _errorHandler (res : http.ServerResponse, err? : Error) : void {
    if (err) {console.log(err.toString())}
    let _self : HttpTS = this
    this._readFile(this._errorFile, function(err : NodeJS.ErrnoException, data : Buffer){
      res.writeHead(404, _self._mime('html'));
      res.end(data.toString());
    });
  }
                                                              
  private _mime (type : string) : {'Content-Type' : string} {      //to get mime
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
  }
                                                                   //to send text
  private _send (Text : string, res : http.ServerResponse) : void {
    res.writeHead(200, this._mime('text'));
    res.end(Text);
  }
                                                                   //to read file
  private _readFile (path : string, cb : (cbErr : NodeJS.ErrnoException, cbData : Buffer) => void) : void {
    fs.readFile(path, function(err : NodeJS.ErrnoException, data : Buffer) : void {
      cb(err,data)
    })
  }
                                                                   //to send file
  private _sendFile (path : string, res : http.ServerResponse) : void {
    let _self : HttpTS = this
    let type : string = path.split('.').pop();
    this._readFile(path,function(err : NodeJS.ErrnoException, data : Buffer){
      if (err) {_self._errorHandler(res,err)}
      res.writeHead(200, _self._mime(type));
      res.end(data.toString());
    })
  }

}

export default HttpTS;