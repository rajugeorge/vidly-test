const express = require('express');
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const router = express.Router();
const { checkId } = require('../middleware/db');

router.get('/', async (req, res) => {
    // get all genres
    const rentals = await Rental.find().sort('title');

    // return the rentals
    res.send(rentals);
});

router.get('/:id', checkId, async (req, res) => {
    // get genre by id
    const rental = await Rental.findById(req.params.id);

    if (!rental)
        return res
            .status(404)
            .send('The rental with the given ID was not found.');

    // return the genres
    res.send(rental);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = await Customer.findById(req.body.customerId);

    if (!customer)
        return res
            .status(404)
            .send('The customer with the given ID was not found.');

    let movie = await Movie.findById(req.body.movieId);

    if (!movie)
        return res
            .status(404)
            .send('The movie with the given ID was not found.');

    if (movie.numberInStock === 0)
        return res.status(404).send('The movie is out of stock');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    rental = await rental.save();

    movie.numberInStock--;
    await movie.save();

    res.send(rental);
});

router.put('/:id', checkId, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // get customer by id
    let rental = await Rental.findById(req.params.id);

    if (!rental)
        return res
            .status(404)
            .send('The Rental with the given ID was not found.');

    let customer = await Customer.findById(req.body.customerId);

    if (!customer)
        return res
            .status(404)
            .send('The customer with the given ID was not found.');

    let movie = await Movie.findById(req.body.movieId);

    if (!movie)
        return res
            .status(404)
            .send('The movie with the given ID was not found.');

    rental.set({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    rental = await rental.save();

    res.send(rental);
});

module.exports = router;
