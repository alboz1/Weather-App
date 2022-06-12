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
                // registration failed
                console.log('ServiceWorker registration failed: ', err);
              });
            });
        }
        this.getCurrentLocationWeather();
        controllers.searchCity();
        controllers.switchUnits();
    },

    getCurrentLocationWeather() {
        if ("geolocation" in navigator) {
            const options = {
                timeout: 10000
            }
            navigator.geolocation.getCurrentPosition(position => {
                this.getWeatherData({
                    currentWeather: `/current-weather/?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${this.unit}`,
                    forecastWeather: `/forecast-weather/?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${this.unit}`
                });
            }, error => {
                view.showError(error, 'Please enable location to immediately see your local weather or you can search for it.');
            }, options);
        } else {
            console.log('Your browser does not support geolocation');
        }
    },

    getWeatherData(options) {
        const currentWeather = axios.get(options.currentWeather);
        const forecastWeather = axios.get(options.forecastWeather);

        const weatherData = Promise.all([currentWeather, forecastWeather]);

        weatherData.then(data => {
            const [ currentWeather, forecastWeather ] = data;
            const button = document.querySelector('button[type="submit"]');
            button.removeAttribute('disabled');
            document.querySelector('.spinner').style.display = 'none';

            view.showCurrentWeather({
                city: currentWeather.data.name,
                temperature: currentWeather.data.main.temp,
                feelsLike: currentWeather.data.main.feels_like,
                wind: currentWeather.data.wind.speed,
                temp_max: currentWeather.data.main.temp_max,
                temp_min: currentWeather.data.main.temp_min,
                icon: currentWeather.data.weather[0].id,
                info: currentWeather.data.weather[0].description,
                hours: currentWeather.data.dt
            });
            view.countryInfo(currentWeather.data, currentWeather.data.sys.country);

            view.showForecast({
                forecasts: forecastWeather.data.list
            });
        })
        .catch(error => {
            view.showError(error);
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
            const deg = Number(el.textContent);
            if (app.celsius) {
                const celsiusDeg = Math.round((deg - 32) * 5/9);
                el.textContent = celsiusDeg;
            } else {
                const fahrenheitDeg = Math.round((deg * 9/5) + 32);
                el.textContent = fahrenheitDeg;
            }
        });
    }
};

const view = {
    showCurrentWeather(options) {
        document.querySelector('main').style.display = 'block';
        document.querySelector('.error').style.display = 'none';
        const info = document.querySelector('.info');
        const city = document.querySelector('.city-name');
        const temperature = document.querySelector('.temperature');
        const feelsLike = document.querySelector('.feels-like');
        const wind = document.querySelector('.wind');
        const high = document.querySelector('.high');
        const low = document.querySelector('.low');
        const icon = document.querySelector('.weather-icon i');
        const description = document.querySelector('.weather-info-text');
        
        info.style.display = 'flex';
        city.textContent = options.city;
        temperature.textContent = Math.round(options.temperature);
        feelsLike.textContent = Math.round(options.feelsLike);
        wind.textContent = `Wind: ${Math.round(options.wind * 3.6)} km/h`;
        high.textContent = Math.round(options.temp_max);
        low.textContent = Math.round(options.temp_min);
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
                    <span class="deg">${Math.round(forecast.temp.max)}</span>
                    <span class="deg">${Math.round(forecast.temp.min)}</span>
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

    showError(error, costumError) {
        const errorEl = document.querySelector('.error');
        const info = document.querySelector('.info');
        const button = document.querySelector('button[type="submit"]');
        button.removeAttribute('disabled');
        document.querySelector('.spinner').style.display = 'none';
        info.style.display = 'none';
        document.querySelector('main').style.display = 'none';
        errorEl.style.display = 'block';

        if (costumError) {
            errorEl.textContent = costumError;
            return;
        }
        const message = error.response.data.message.charAt(0).toUpperCase() + error.response.data.message.slice(1);

        errorEl.textContent = message;
    }
};

const controllers = {
    searchCity() {
        const form = document.querySelector('#search-form');
        const button = form.querySelector('button');

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            document.querySelector('.spinner').style.display = 'flex';
            button.setAttribute('disabled', 'true');
            let cityName = document.querySelector('#search-field').value;

            app.getWeatherData({
                currentWeather: `/current-weather/?units=${app.unit}&q=${cityName}`,
                forecastWeather: `/forecast-weather/?units=${app.unit}&q=${cityName}`
            });
        });
    },

    switchUnits() {
        const unitsSwitch = document.querySelector('.units-switch');

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