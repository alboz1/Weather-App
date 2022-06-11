const https = require('https');

function getData(API_URL, response) {
    https.get(API_URL, res => {
        let data = '';

        res.on('data', chunk => {
            data += chunk;
        });

        res.on('end', () => {
            response.writeHead(res.statusCode, {
                'Content-Type': 'application/json'
            });
            response.end(data);
        });

        res.on('error', error => {
            const errMessage = {
                message: 'Something went wrong.'
            };
            response.writeHead(500, {
                'Content-Type': 'application/json'
            });
            response.end(JSON.stringify(errMessage));
        });
    });
}

module.exports = getData;