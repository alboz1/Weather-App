const app = {
    weekDays: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],

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
                this.getWeatherForecast('http://api.openweathermap.org/data/2.5/forecast/daily?cnt=6', {
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
                info: response.data.weather[0].description,
                hours: response.data.dt
            });
            view.countryInfo(response.data.dt, response.data.sys.country);
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
    },

    nightDayIcons(icon, hours) {
        if (hours >= 0 && hours < 5) {
            return `wi wi-owm-night-${icon}`;
        }

        if (hours >= 5 && hours < 11) {
            return `wi wi-owm-day${icon}`;
        }

        if (hours >= 11 && hours < 16) {
            return `wi wi-owm-${icon}`
        }

        if (hours >= 16 && hours <= 23) {
            return `wi wi-owm-night-${icon}`;
        }
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
        icon.className = app.nightDayIcons(options.icon, new Date(options.hours * 1000).getHours());
        description.textContent = options.info;
    },

    showForecast(options) {
        const forecastWrapper = document.querySelector('.week-weather-info');
        forecastWrapper.innerHTML = '';

        options.forecasts.shift();
        options.forecasts.forEach(forecast => {
            let day = new Date(forecast.dt * 1000).getDay();

            const output = `
            <div class="day-wrapper">
                <h3 class="week-day">${app.weekDays[day]} <span class="deg">${Math.round(forecast.temp.day)}&deg;C</span></h3>
                <i class="wi wi-owm-${forecast.weather[0].id}"></i>
                <p>${forecast.weather[0].main}</p>
            </div>`;

            forecastWrapper.innerHTML += output;
        });
    },

    countryInfo(info, country) {
        const months = ['Jan','Feb','Mar','Apr','May' ,'June','July','Aug','Sept','Oct','Nov','Dec'];

        const fullDate = new Date(info * 1000);
        const date = fullDate.getDate();
        const day = app.weekDays[fullDate.getDay()];
        const month = months[fullDate.getMonth()];
        const year = fullDate.getFullYear();

        document.querySelector('.city-info').textContent = `${country}, ${day} ${month} ${date} ${year}`;
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
            app.getWeatherForecast('http://api.openweathermap.org/data/2.5/forecast/daily?cnt=6', {
                name: cityName
            });
        });
    }
};
app.init();