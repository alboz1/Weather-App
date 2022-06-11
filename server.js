require('dotenv').config();
const http = require('http');

const requestListener = require('./utils/requestListener');
const port = process.env.PORT || 4000;

const app = http.createServer(requestListener);

app.listen(port, () => console.log(`Listening to port ${port}`));