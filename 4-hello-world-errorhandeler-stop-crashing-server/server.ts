///<reference path="./typings/node/node.d.ts" />

import http = require('http')
import fs   = require('fs')                              

http.createServer(function (req : http.ServerRequest, res : http.ServerResponse) {
  
  res.writeHead(200, {'Content-Type': 'text/html'}); 
  fs.readFile('./index.html', function(err : Error, data : Buffer){      
    if (err) {
      console.log(err.toString());   //Log the error on console
      res.end('404 - Not Found');    //Return not found response to client
      return;      
    }
    res.end(data.toString());                           
  })
  
}).listen(3000);

console.log('Server running at http://localhost:3000/');