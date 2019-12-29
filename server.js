const http = require('http');
require('dotenv').config();

const getWeatherInfo = require('./controllers/getWeatherInfo');
const staticFiles = require('./controllers/staticFiles');

const API_KEY = process.env.API_KEY;
const port = process.env.port || 3000;


const app = http.createServer((req, res) => {
    if (req.url.includes('/current-weather')) {
        getWeatherInfo(req, res, API_KEY, 'https://api.openweathermap.org/data/2.5/weather?');
    } else if (req.url.includes('/forecast-weather')) {
        getWeatherInfo(req, res, API_KEY, 'https://api.openweathermap.org/data/2.5/forecast/daily?cnt=6&');
    } else {
        //serve any file in the public folder
        staticFiles(req, res);
    }
  
});

app.listen(port, () => console.log(`Listening to port ${port}`));