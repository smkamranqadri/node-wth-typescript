///<reference path="./typings/node/node.d.ts" />

//importing modules
import http = require('http')
import fs   = require('fs')       

//custom functions
function errorHandle(err : Error, res : http.ServerResponse){    //Custom function of handle error for reusing the code
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
  if (req.url == '/') {                                          //Checking what is the url to setup routes
      sendFile('./index.html',res);                              //calling custom fucntion to sending file to server
  } else if (req.url == '/contact') {                            //Checking what is the url to setup routes
      sendFile('./contact.html',res);                            //calling custom fucntion to sending file to server
  }
  
}).listen(3000);

console.log('Server running at http://localhost:3000/');