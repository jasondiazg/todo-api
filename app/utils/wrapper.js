const logger = require('./logger.js');

const wrapper = {
    sendResponse: (options) => {
        logger({ method: options.method, message: JSON.stringify(options.response), isError: options.response.error });
        options.res.status(options.httpCode);
        options.res.json(options.response);
    }
}

module.exports = wrapper;