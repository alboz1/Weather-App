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
    }
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
} 