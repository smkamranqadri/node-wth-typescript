///<reference path="./typings/node/node.d.ts" />
//importing modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
function errorHandle(err, res) {
    if (typeof err === 'string') {
        console.log(err);
    }
    else if (typeof err === 'NodeJS.ErrnoException') {
        console.log(err.toString());
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Not Found');
}
function sendFile(path, res, mime) {
    fs.readFile(path, function (err, data) {
        if (err) {
            errorHandle(err, res);
            return;
        }
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data.toString());
    });
}
function renderFile(path, res, mime, tasks) {
    fs.readFile(path, function (err, data) {
        if (err) {
            errorHandle(err, res);
            return;
        }
        var temp = data.toString();
        var html = '<table>';
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
        temp = temp.replace('editHere', html);
        res.writeHead(200, { 'Content-Type': mime });
        res.end(temp);
    });
}
function getData(tasks) {
    fs.readFile('./data/data.json', function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        var temp = JSON.parse(data.toString());
        for (var i = 0; i < temp.length; i++) {
            tasks.push(temp[i]);
        }
    });
}
function setData(tasks) {
    fs.writeFile('./data/data.json', JSON.stringify(tasks), function (err) {
        if (err) {
            console.log(err);
            return;
        }
    });
}
//data array
var tasks = [];
getData(tasks);
//creating server
http.createServer(function (req, res) {
    //setting get method
    var currentUrl = url.parse(req.url);
    var queryObject = qs.parse(currentUrl.query);
    if (queryObject.action == 'Submit') {
        tasks.push(queryObject.task);
        renderFile('./view/template.html', res, 'text/html', tasks);
        setData(tasks);
        return;
    }
    else if (queryObject.action == 'Delete') {
        tasks.splice(parseInt(queryObject.task), 1);
        renderFile('./view/template.html', res, 'text/html', tasks);
        setData(tasks);
        return;
    }
    //setting routes
    switch (req.url) {
        case '/':
            renderFile('./view/template.html', res, 'text/html', tasks);
            break;
        case '/style.css':
            sendFile('./public/style.css', res, 'text/css');
            break;
        default:
            errorHandle(req.url + ' => didn\'t Handled', res);
            break;
    }
}).listen(3000);
console.log('Server running at http://localhost:3000/');
