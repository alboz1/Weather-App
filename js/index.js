const app = {
    getCurrentLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                this.getWeatherData(position.coords.latitude, position.coords.longitude);
                this.getWeatherForecast(position.coords.latitude, position.coords.longitude);
            });
        } else {
            console.log('Your browser does not support geolocation');
        }
    },

    getWeatherData(lat, long) {
        return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&APPID=0d98ce1dc6f1122e38b37f94c7fd3424`)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
    },

    getWeatherForecast(lat, long) {
        return axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&APPID=0d98ce1dc6f1122e38b37f94c7fd3424`)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        })
    }
};

app.getCurrentLocation();