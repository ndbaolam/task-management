const express = require('express');
const database = require('./config/database');
const bodyParser = require('body-parser')
require('dotenv').config();

const routesApiVer1 = require('./api/v1/routers/index.route');

database.connect();

const app = express();
const port = process.env.PORT;

// parse application/json
app.use(bodyParser.json());

//API Routes
routesApiVer1(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});