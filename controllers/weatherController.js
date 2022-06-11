const getData = require('../utils/getData');

function current_weather_get(req, response) {
    const url = new URL(`https://${req.headers.host}${req.url}`);
    const params = url.searchParams.toString();
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?${params}&appid=${process.env.API_KEY}`;
    getData(API_URL, response);
}

function forecast_weather_get(req, response) {
    const url = new URL(`https://${req.headers.host}${req.url}`);
    const params = url.searchParams.toString();
    const API_URL = `https://api.openweathermap.org/data/2.5/forecast/daily?${params}&cnt=6&appid=${process.env.API_KEY}`;
    getData(API_URL, response);
}

module.exports = {
    current_weather_get,
    forecast_weather_get
};