const axios = require('axios');

module.exports = (req, res, key, apiURL) => {
  let url = new URL(apiURL);
  //get params from the request url
  const reqUrlParams = req.url.split('?')[1].split(',');
  console.log(reqUrlParams);
  let urlParams;

  if (reqUrlParams.length === 2) {
    urlParams = new URLSearchParams({
      APPID:key,
      units: reqUrlParams[0],
      q: reqUrlParams[1]
    });
  } else {
    //set the params from the request url to the open weather api url
    urlParams = new URLSearchParams({
        APPID: key,
        lat: reqUrlParams[0],
        lon: reqUrlParams[1],
        units: reqUrlParams[2]
    });
  }
  url = url + urlParams.toString();

  axios.get(url).then(response => {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(response.data));
  }).catch(error => {
    let errorType;

    switch(error.response.status) {
      case 404:
        errorType = 404;
        break;
      case 400:
        errorType = 400;
        break;
      case 500:
        errorType = 500;
        break;
    }

    res.writeHead(errorType, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(error));
  });
}