///<reference path="./typings/node/node.d.ts" />
var HttpTS_1 = require('lib/HttpTS');
var server = new HttpTS_1.default();
server.route('/', 'text', 'Hello World');
server.route('/home', 'html', 'index.html');
server.start;
