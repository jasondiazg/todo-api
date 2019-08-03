const express = require('express');
const serverSetup = require('./app/config/server.config');
const mongooseSetup = require('./app/config/mongoose.config');
const backend = require('./app/config/expose.routes.config');

// create express app
const app = express();
const port = 3001;

// server configurations
serverSetup.configure(app);

// mongoose configuration
mongooseSetup.configure();

// expose server health
serverSetup.checkHealth(app, port);

// Routes to expose
backend.exposeRoutes(app);

// listen for requests
serverSetup.listen(app, port);