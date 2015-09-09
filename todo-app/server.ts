///<reference path="./typings/node/node.d.ts" />

//importing modules
import http = require('http')
import fs   = require('fs')
import url  = require('url')
import qs   = require('querystring')       

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
}

function sendFile(path : string, res : http.ServerResponse, mime : string) { 
  fs.readFile(path, function(err : NodeJS.ErrnoException, data : Buffer) {      
    if (err) {
      errorHandle(err, res);
      return;
    }
    res.writeHead(200, {'Content-Type': mime});                                 
    res.end(data.toString());  
  })
}

function renderFile(path : string, res : http.ServerResponse, mime : string, tasks : Array<string>) {
  fs.readFile(path, function(err : NodeJS.ErrnoException, data : Buffer) {      
    if (err) {
      errorHandle(err, res);
      return;
    }
    let temp : string = data.toString();
    let html : string = '<table>';
    html += '<tr>';
    html += '<th width="80%" colspan=2>';
    html += 'Tasks';
    html += '</th>';
    html += '<th width="20%">';
    html += '</th>';
    html += '</tr>';
    for (var i = 0; i < tasks.length; i++) {
      html += '<tr>';
      html += '<td>';
      html += tasks[i];
      html += '<td>';
      html += '<td>';
      html += '<a href=\'?task=' + i + '&action=Delete\'>Delete</a>';
      html += '<td>';
      html += '</tr>';
    }
    html += '</table>';
    temp = temp.replace('editHere', html)
    res.writeHead(200, {'Content-Type': mime});                                 
    res.end(temp);  
  })
}

function getData(tasks : Array<string>) {
  fs.readFile('./data/data.json', function(err : NodeJS.ErrnoException, data : Buffer) {      
    if (err) {
      console.log(err);
      return;
    }
    let temp : {index :  number, task : string, length : number} = JSON.parse(data.toString())
    for (var i = 0; i < temp.length; i++) {
      tasks.push(temp[i]);
    }  
  })
}

function setData(tasks : Array<string>) {
  fs.writeFile('./data/data.json', JSON.stringify(tasks), function(err : NodeJS.ErrnoException){
    if (err) {
      console.log(err);
      return;
    }
  })
}

//data array
let tasks : Array<string> =[];
getData(tasks);

//creating server
http.createServer(function(req : http.ServerRequest, res : http.ServerResponse) {

//setting get method
let currentUrl : url.Url = url.parse(req.url);
let queryObject : {task : string, action : string} = qs.parse(currentUrl.query);
if (queryObject.action == 'Submit') {
  tasks.push(queryObject.task);
  renderFile('./view/template.html', res, 'text/html', tasks)
  setData(tasks);
  return;
} else if (queryObject.action == 'Delete') {
  tasks.splice(parseInt(queryObject.task), 1);
  renderFile('./view/template.html', res, 'text/html', tasks)
  setData(tasks);
  return;
}

//setting routes
  switch (req.url) {
    case '/':                                          
      renderFile('./view/template.html', res, 'text/html', tasks)
      break;
    case '/style.css':                                          
      sendFile('./public/style.css', res, 'text/css');
      break;
    
    default:
      errorHandle(req.url + ' => didn\'t Handled',res);
      break;
  }

}).listen(3000);

console.log('Server running at http://localhost:3000/');