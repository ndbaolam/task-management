const express = require('express');
const database = require('./config/database');
require('dotenv').config();

const routesApiVer1 = require('./api/v1/routers/index.route');

database.connect();

const app = express();
const port = process.env.PORT;

//API Routes
routesApiVer1(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});