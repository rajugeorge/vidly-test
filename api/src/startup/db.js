const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
    mongoose.connect(config.get('database.DB_URL')).then(() => {
        winston.info(`Connected to db : ${config.get('database.DB_URL')}`);
    });
};
