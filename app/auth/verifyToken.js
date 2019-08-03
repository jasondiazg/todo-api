const jwt = require('jsonwebtoken');
const config = require('./secrets');
const wrapper = require('../utils/wrapper');

const verifyToken = (req, res, next) => {

    // check headers for token
    let token = req.header('x-access-token') || req.header('Authorization');
    if (!token) {
        let response = { "status": "error", "message": "No token provided.", "error": true, "data": undefined };
        return wrapper.sendResponse({ method: "auth: verify token", response: response, httpCode: 401, res: res });
    } else {
        // verifies secret and checks exp
        token = token.split(" ");
        if (!token || token.length <= 1 || token[0] !== 'Bearer') {
            let response = { "status": "error", "message": "Token invalid.", "error": true, "data": undefined };
            return wrapper.sendResponse({ method: "auth: validate token", response: response, httpCode: 401, res: res });
        } else {
            token = token[1];
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    let response = { "status": "error", "message": "Failed to authenticate token.", "error": true, "data": undefined };
                    return wrapper.sendResponse({ method: "auth: authenticate token", response: response, httpCode: 401, res: res });
                }

                // if everything is good, save to request for use in other routes
                req.id = decoded.id;
                next();
            });
        }
    }
}

module.exports = verifyToken;