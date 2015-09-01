///<reference path="./typings/node/node.d.ts" />
var HttpTS_1 = require('./lib/HttpTS'); //import custom module in typescript style
var server = new HttpTS_1.default(3000); //creat object from class
server.errorFile('./html/error.html'); //set error file path
server.route('/', 'text', 'Hello World'); //set route
server.route('/home', 'html', './html/index.html');
server.start(); //start the server
