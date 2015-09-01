///<reference path="./typings/node/node.d.ts" />

import HttpTS from './lib/HttpTS';						//import custom module in typescript style

let server : HttpTS = new HttpTS(3000);					//creat object from class
server.errorFile ('./public/error.html');				//set error file path
server.route ('/', 'text', 'Hello World');				//set route
server.route ('/home', 'html', './public/index.html');
server.start();											//start the server