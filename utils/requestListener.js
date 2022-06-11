const fs = require('fs');
const path = require('path');
const { current_weather_get, forecast_weather_get } = require('../controllers/weatherController');
const staticFiles = require('./staticFiles');

function requestListener(req, res) {
    if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
        res.writeHead(301, {
            'Location': `https://${req.headers.host}${req.url}`
        });
        res.end();
        return;
    }

    if (req.url === '/') {
        fs.createReadStream(path.resolve(__dirname, '../public', 'index.html')).pipe(res);
    } else if (req.url.match(/\/current-weather\/\?(.*)/)) {
        current_weather_get(req, res);
    } else if (req.url.match(/\/forecast-weather\/\?(.*)/)) {
        forecast_weather_get(req, res);
    } else if (req.url.match(/\/(.*)/)) {
        //serve any file in the public folder
        staticFiles(req, res);
    }
}

module.exports = requestListener;