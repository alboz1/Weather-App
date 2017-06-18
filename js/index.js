const app = {
    getCurrentLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                this.currentWeatherData(position.coords.latitude, position.coords.longitude);
                this.getWeatherForecast(position.coords.latitude, position.coords.longitude);
            });
        } else {
            console.log('Your browser does not support geolocation');
        }
    },

    currentWeatherData(lat, long) {
        return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&APPID=0d98ce1dc6f1122e38b37f94c7fd3424`)
        .then(response => {
            console.log(response);
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

    getWeatherForecast(lat, long) {
        return axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&APPID=0d98ce1dc6f1122e38b37f94c7fd3424`)
        .then(response => {
            console.log(response);
            view.showForecast({
                day: response.data.list[0].dt_txt,
                forecast: response.data.list
            });
        })
        .catch(error => {
            console.log(error);
        })
    },

    formatDate(date) {
        return new Date(date).getDay();
    }
};

const view = {
    showCurrentWeather(options) {
        const city = document.querySelector('.city-name');
        const deg = document.querySelector('.deg');
        const icon = document.querySelector('.weather-icon i');
        const description = document.querySelector('.weather-info-text');

        city.textContent = options.city;
        deg.innerHTML = `${options.deg}&deg;C`;
        icon.className = `wi wi-owm-${options.icon}`;
        description.textContent = options.info;
    },

    showForecast(options) {
        const weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const curDate = new Date().getDate();
        const forecasts = options.forecast.filter(day => new Date(day.dt_txt).getDate() !== curDate);
        console.log(forecasts);
        console.log(weekDays[app.formatDate(options.day)]);
    }
};

app.getCurrentLocation();