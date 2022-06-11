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

    const readFile = fs.createReadStream(filePath);

    res.writeHead(200, {
        'Content-Type': contentType
    });

    readFile.on('error', error => {
        if (error.code == 'ENOENT') {
            res.writeHead(404, {'Content-Type': 'text/html'});
            fs.createReadStream(`${__dirname}/../public/404.html`).pipe(res);
        } else {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Something went wrong.');
        }
    })
    .pipe(res);
} 