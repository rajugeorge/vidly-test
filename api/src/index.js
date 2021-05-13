const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const startUpDebug = require('debug')('app:startup');
const morgan = require('morgan');
const homeRouter = require('./routes/home');
const genresRouter = require('./routes/genre');
const app = express();

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', homeRouter);
app.use('/api/genres', genresRouter);

const init = async function () {
    try {
        const result = await mongoose.connect(config.get('database.DB_URL'));
        startUpDebug('Connected to db');

        return app.listen(3000, () => {
            startUpDebug('server started listening');
        });
    } catch (err) {
        startUpDebug('Start Up error', err);
    }
};

init();
