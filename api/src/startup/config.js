const config = require('config');

module.exports = function () {
    if (!config.get('authentication.jwtkey')) {
        throw new Error('Fatal error jwt key missing');
    }
};
