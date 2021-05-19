const express = require('express');
const morgan = require('morgan');
const homeRouter = require('../routes/home');
const genresRouter = require('../routes/genre');
const customersRouter = require('../routes/customer');
const moviesRouter = require('../routes/movie');
const rentalsRouter = require('../routes/rentals');
const userRouter = require('../routes/user');
const authRouter = require('../routes/auth');
const returnsRouter = require('../routes/returns');
const error = require('../middleware/error');

module.exports = function (app) {
    app.use(morgan('tiny'));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use('/', homeRouter);
    app.use('/api/genres', genresRouter);
    app.use('/api/customers', customersRouter);
    app.use('/api/movies', moviesRouter);
    app.use('/api/rentals', rentalsRouter);
    app.use('/api/users', userRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/returns', returnsRouter);

    app.use(error);
};
