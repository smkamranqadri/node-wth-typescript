///<reference path="./typings/node/node.d.ts" />

//importing modules
import http = require('http')
import fs   = require('fs')       

//custom functions
function errorHandle(err : NodeJS.ErrnoException, res : http.ServerResponse);     //function overload
function errorHandle(err : string,                res : http.ServerResponse);
function errorHandle(err : any,                   res : any) {    
  if (typeof err === 'string') {
    console.log(err);
  } else if (typeof err === 'NodeJS.ErrnoException') {
    console.log(err.toString());
  }
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('404 - Not Found');
  return;
}

function sendFile(path : string, res : http.ServerResponse) { 
  fs.readFile(path, function(err : NodeJS.ErrnoException, data : Buffer) {      
    if (err) {errorHandle(err, res);}
    res.writeHead(200, {'Content-Type': 'text/html'});                                 
    res.end(data.toString());                           
  })
}

//creating server
http.createServer(function(req : http.ServerRequest, res : http.ServerResponse) {

//setting routes
  switch (req.url) {
    case '/':                                          
      sendFile('./index.html', res);
      break;
    case '/contact':
      if (req.method == 'GET') {                            //Checking in which methon request is coming and routing accordingly
        sendFile('./contact.html', res);
      } else if (req.method == 'POST') {
        res.end('You will be contact soon...');
      }
      break;
    default:
      errorHandle(req.url + ' => didn\'t Handled',res);
      break;
  }

}).listen(3000);

console.log('Server running at http://localhost:3000/');