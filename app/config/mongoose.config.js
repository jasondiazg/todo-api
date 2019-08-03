
const mongoose = require('mongoose');
const dbConfig = require('./database.config');
const logger = require('../utils/logger');

const moongoseConfig = {
    configure: () => {
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
    }
}

module.exports = moongoseConfig;