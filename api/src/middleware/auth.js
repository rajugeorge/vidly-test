const jwt = require('jsonwebtoken');
const config = require('config');
const winston = require('winston');

const checkAuth = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('User not authenticated');

    try {
        const payload = jwt.verify(token, config.get('authentication.jwtkey'));

        req.payload = payload;
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
};

exports.checkAuth = checkAuth;
