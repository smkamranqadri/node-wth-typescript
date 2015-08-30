///<reference path="./typings/node/node.d.ts" />

import HttpTS from 'lib/HttpTS';

let server : HttpTS = new HttpTS();
server.route ('/', 'text', 'Hello World');
server.route ('/home', 'html', 'index.html');
server.start