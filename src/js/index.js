const app = {
    weekDays: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    celsius: true,
    unit: 'metric',

    init() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('sw.js').then(function(registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
              }, function(err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
              });
            });
        }
        this.getCurrentLocationWeather();
        view.eventListeners();
    },

    getCurrentLocationWeather() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                this.currentWeatherData(`/current-weather/?${position.coords.latitude},${position.coords.longitude},${this.unit}`);
                this.getWeatherForecast(`/forecast-weather/?${position.coords.latitude},${position.coords.longitude},${this.unit}`);
            });
        } else {
            console.log('Your browser does not support geolocation');
        }
    },

    currentWeatherData(url) {
       return axios.get(url)
        .then(response => {
            document.querySelector('.spinner').style.display = 'none';
            view.showCurrentWeather({
                city: response.data.name,
                temperature: response.data.main.temp,
                feelsLike: response.data.main.feels_like,
                icon: response.data.weather[0].id,
                info: response.data.weather[0].description,
                hours: response.data.dt
            });
            view.countryInfo(response.data, response.data.sys.country);
        })
        .catch(error => {
            document.querySelector('.spinner').style.display = 'none';
            const errorEl = document.querySelector('.error');
            document.querySelector('main').style.display = 'none';
            errorEl.style.display = 'block';

            if (!error.response) {
                errorEl.textContent = 'Please connect to internet';
            }
            if (error.response.status === 404) {
                errorEl.textContent = 'Sorry, city not found';
            }
        });
    },

    getWeatherForecast(url) {
        return axios.get(url)
        .then(response => {
            document.querySelector('.spinner').style.display = 'none';
            view.showForecast({
                forecasts: response.data.list
            });
        })
        .catch(error => {
            document.querySelector('.spinner').style.display = 'none';
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

        if (hours >= 11 && hours < 18) {
            return `wi wi-owm-${icon}`;
        }

        if (hours >= 18 && hours <= 23) {
            return `wi wi-owm-night-${icon}`;
        }
    },

    convertTemp() {
        const degEl = document.querySelectorAll('.deg');
        degEl.forEach(el => {
            const deg = Number(el.textContent.includes('Feels') ? el.textContent.split(' ')[2] : el.textContent.split(' ')[0]);
            if (app.celsius) {
                const celsiusDeg = Math.round((deg - 32) * 5/9);
                el.textContent = el.textContent.includes('Feels') ?`Feels like ${celsiusDeg} °C` : `${celsiusDeg} °C`;
            } else {
                const fahrenheitDeg = Math.round((deg * 9/5) + 32);
                el.textContent = el.textContent.includes('Feels') ?`Feels like ${fahrenheitDeg} °F` : `${fahrenheitDeg} °F`;
            }
        })
    }
};

const view = {
    showCurrentWeather(options) {
        document.querySelector('main').style.display = 'block';
        document.querySelector('.error').style.display = 'none';
        const city = document.querySelector('.city-name');
        const temperature = document.querySelector('.temperature');
        const feelsLike = document.querySelector('.feels-like');
        const icon = document.querySelector('.weather-icon i');
        const description = document.querySelector('.weather-info-text');

        city.textContent = options.city;
        temperature.textContent = `${Math.round(options.temperature)}${app.celsius ? ' °C' : ' °F'}`;
        feelsLike.textContent = `Feels like ${Math.round(options.feelsLike)}${app.celsius ? ' °C' : ' °F'}`;
        icon.className = app.nightDayIcons(options.icon, new Date(options.hours * 1000).getHours());
        description.textContent = options.info;
    },

    showForecast(options) {
        const forecastWrapper = document.querySelector('.week-weather-info');
        forecastWrapper.innerHTML = '';

        options.forecasts.shift();
        options.forecasts.forEach(forecast => {
            let day = new Date(forecast.dt * 1000).getUTCDay();

            const output = `
            <div class="day-wrapper">
                <h3 class="week-day">
                    ${app.weekDays[day]}
                    <span class="deg">${Math.round(forecast.temp.max)} &deg;${app.celsius ? 'C' : 'F'}</span>
                    <span class="deg">${Math.round(forecast.temp.min)} &deg;${app.celsius ? 'C' : 'F'}</span>
                </h3>
                <i class="wi wi-owm-${forecast.weather[0].id}"></i>
                <p>${forecast.weather[0].main}</p>
            </div>`;

            forecastWrapper.innerHTML += output;
        });
    },

    countryInfo(info, country) {
        const months = ['Jan','Feb','Mar','Apr','May' ,'June','July','Aug','Sept','Oct','Nov','Dec'];
        const fullDate = new Date((info.dt + info.timezone) * 1000);
        const date = fullDate.getUTCDate();
        const day = app.weekDays[fullDate.getUTCDay()];
        const month = months[fullDate.getUTCMonth()];
        const year = fullDate.getUTCFullYear();

        document.querySelector('.city-info').textContent = `${country ? country : ''} ${day} ${month} ${date} ${year}`;
    },

    eventListeners() {
        const form = document.querySelector('#search-form');
        const unitsSwitch = document.querySelector('.units-switch');

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const cityName = document.querySelector('#search-field').value;
            if (cityName === '') return;
            app.currentWeatherData(`/current-weather/?${app.unit},${cityName}`);
            app.getWeatherForecast(`/forecast-weather/?${app.unit},${cityName}`);
        });
        //switch units celsius between fahrenheit
        unitsSwitch.addEventListener('click', function() {
            const btn = this.querySelector('.switch');
            btn.classList.toggle('switched');
            app.celsius = !app.celsius;
            app.unit = app.celsius ? 'metric' : 'imperial';
            btn.innerHTML = app.celsius ? 'C&deg;' : 'F&deg;';
            app.convertTemp();
        });
    }
};
app.init();