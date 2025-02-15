// Create web server
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const comments = require('./comments');

const server = http.createServer((req, res) => {
  // Get URL
  const urlObj = url.parse(req.url, true);
  // Get pathname
  const pathname = urlObj.pathname;
  // Get query
  const query = urlObj.query;

  if (pathname === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), 'utf-8', (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('Not Found');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        res.end(data);
      }
    });
  } else if (pathname === '/api/comments') {
    if (req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json;charset=utf-8');
      res.end(JSON.stringify(comments));
    } else if (req.method === 'POST') {
      let str = '';
      req.on('data', (chunk) => {
        str += chunk;
      });
      req.on('end', () => {
        const comment = JSON.parse(str);
        comment.time = new Date();
        comments.unshift(comment);
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.end(JSON.stringify(comment));
      });
    }
  } else {
    fs.readFile(path.join(__dirname, pathname), (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('Not Found');
      } else {
        res.statusCode = 200;
        res.end(data);
      }
    });
  }
});

server.listen(3000, () => {
  console.log('Server is running at http://