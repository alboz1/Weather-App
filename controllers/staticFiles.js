const path = require('path');
const fs = require('fs');

module.exports = (req, res) => {
    const filePath = __dirname +'/../public' + (req.url === '/' ? '/index.html' : req.url);
    const fileExtName = path.extname(filePath);
    let contentType = 'text/html';
    
    switch(fileExtName) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.ico':
            contentType = 'text/html';
            break;
    }
    fs.readFile(filePath, 'utf8', (err) => {
        if (err) {
            if (err.code == 'ENOENT') {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('404 not found');
            }
        } else {
            if (req.headers['protocol'] === 'http' && !req.headers.host.includes('localhost')) {
                res.writeHead(301, {'Location': 'https://' + req.headers.host + req.url});
                fs.createReadStream(filePath).pipe(res);
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                fs.createReadStream(filePath).pipe(res);
            }
        }
    });
} 