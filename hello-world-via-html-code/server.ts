///<reference path="./typings/node/node.d.ts" />

import http = require('http')

http.createServer(function (req, res) {
  
  res.writeHead(200, {'Content-Type': 'text/html'}); //change plain to html for rendering sent string to html 
  res.write('<html>');
  res.write('<head>');
  res.write('<title>Hello World</title>');
  res.write('</head>');
  res.write('<body>');
  res.write('<h1>Hello World</h1>');          
  res.write('</body>');    
  res.write('</html>');
  res.end();
    
}).listen(3000); //not nesseccery to mention localhost ip address

console.log('Server running at http://localhost:3000/');