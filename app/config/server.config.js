const bodyParser = require('body-parser');
const logger = require('../utils/logger');
const wrapper = require('../utils/wrapper');

const server = {
    configure: (app) => {
        app.all('/*', (req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
            res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
            next();
        });

        // parse requests of content-type - application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: true }));

        // parse requests of content-type - application/json
        app.use(bodyParser.json());
    },

    checkHealth: (app, port) => {
        app.get('/api', (req, res) => {
            const response = { "status": "ok", "message": "Academik api is running in the port " + port + ". It is built with nodejs, express and mongodb.", "error": false, "data": undefined };
            return wrapper.sendResponse({ method: "GET /api", response: response, httpCode: 200, res: res });
        });
    },

    listen: (app, port) => {
        app.listen(port, () => {
            logger({ method: "configuration", message: "Server is listening on port " + port });
        });
    }
}

module.exports = server;