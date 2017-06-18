const app = {
    init() {
        this.getCurrentLocationWeather();
        view.eventListeners();
    },

    getCurrentLocationWeather() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                this.currentWeatherData('http://api.openweathermap.org/data/2.5/weather?',{
                    lat: position.coords.latitude,
                    long: position.coords.longitude
                });
                this.getWeatherForecast('http://api.openweathermap.org/data/2.5/forecast/daily?', {
                    lat: position.coords.latitude,
                    long: position.coords.longitude
                });
            });
        } else {
            console.log('Your browser does not support geolocation');
        }
    },

    currentWeatherData(url, props) {
        return axios.get(url, {
            params: {
                APPID: '0d98ce1dc6f1122e38b37f94c7fd3424',
                lat: props.lat,
                lon: props.long,
                units: 'metric',
                q: props.name
            }
        })
        .then(response => {
            view.showCurrentWeather({
                city: response.data.name,
                deg: response.data.main.temp,
                icon: response.data.weather[0].id,
                info: response.data.weather[0].main
            });
        })
        .catch(error => {
            console.log(error);
        });
    },

    getWeatherForecast(url, props) {
        return axios.get(url, {
            params: {
                APPID: '0d98ce1dc6f1122e38b37f94c7fd3424',
                lat: props.lat,
                lon: props.long,
                units: 'metric',
                q: props.name
            }
        })
        .then(response => {
            view.showForecast({
                forecasts: response.data.list
            });
        })
        .catch(error => {
            console.log(error);
        });
    }
};

const view = {
    showCurrentWeather(options) {
        const city = document.querySelector('.city-name');
        const deg = document.querySelector('.deg');
        const icon = document.querySelector('.weather-icon i');
        const description = document.querySelector('.weather-info-text');

        city.textContent = options.city;
        deg.innerHTML = `${Math.round(options.deg)}&deg;C`;
        icon.className = `wi wi-owm-${options.icon}`;
        description.textContent = options.info;
    },

    showForecast(options) {
        const weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const forecastWrapper = document.querySelector('.week-weather-info');
        let day = new Date().getDay();
        forecastWrapper.innerHTML = '';
        day = 0;
        options.forecasts.shift();
        options.forecasts.forEach(forecast => {
            day++;
            const output = `
            <div class="day-wrapper">
                <h3 class="week-day">${weekDays[day]} <span class="deg">${Math.round(forecast.temp.day)}&deg;C</span></h3>
                <i class="wi wi-owm-${forecast.weather[0].id}"></i>
                <p>${forecast.weather[0].main}</p>
            </div>`;
            forecastWrapper.innerHTML += output;
        });
    },

    eventListeners() {
        const form = document.querySelector('#search-form');

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const cityName = document.querySelector('#search-field').value;
            if (cityName === '') return;
            app.currentWeatherData('http://api.openweathermap.org/data/2.5/weather?', {
                name: cityName
            });
            app.getWeatherForecast('http://api.openweathermap.org/data/2.5/forecast/daily?', {
                name: cityName
            });
        });
    }
};
app.init();