const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const wrapper = require('./app/utils/wrapper.js');
const logger = require('./app/utils/logger.js');
const dbConfig = require('./app/config/database.config.js');
const studentRoutes = require('./app/routes/student.routes.js')

// create express app
const app = express();
const port = 3001;

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    logger({ method: "configuration", message: "Successfully connected to the database on " + dbConfig.url });
}).catch(err => {
    logger({ method: "configuration", message: "ERROR: Could not connect to the database  " + dbConfig.url + ". More information " + err.toString() });
    process.exit();
});

// define a simple route
app.get('/api', (req, res) => {
    const response = { "status": "ok", "message": "Academik api is running in the port " + port + ". It is built with nodejs, express and mongodb.", "error": false, "data": undefined };
    wrapper.sendResponse({ method: "GET /api", response: response, httpCode: 200, res: res });
});

// Routes to expose
studentRoutes(app);

// listen for requests
app.listen(port, () => {
    logger({ method: "configuration", message: "Server is listening on port " + port });
});