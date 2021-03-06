///<reference path="./typings/node/node.d.ts" />

//importing modules
import http = require('http')
import fs   = require('fs')       

//custom functions
function errorHandle(err : Error, res : http.ServerResponse){    
  if (err) {
    console.log(err.toString);
    res.end('404 - Not Found');
    return;
  }
}

function sendFile(path : string, res : http.ServerResponse) {
  res.writeHead(200, {'Content-Type': 'text/html'}); 
    fs.readFile(path, function(err, data) {      
      errorHandle(err,res);                                 
      res.end(data.toString());                           
    })
}

//creating server
http.createServer(function (req : http.ServerRequest, res : http.ServerResponse) {

//setting routes
  if (req.url == '/') {                                          
      sendFile('./index.html',res);                              
  } else if (req.url == '/contact') {
      if (req.method == 'GET') {                            //Checking in which methon request is coming and routing accordingly
          sendFile('./contact.html',res);
      } else if (req.method == 'POST') {
          res.end('You will be contact soon...');
      }
  }
  
}).listen(3000);

console.log('Server running at http://localhost:3000/');