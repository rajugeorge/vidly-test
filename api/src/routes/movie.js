const express = require('express');
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const router = express.Router();
const { checkId } = require('../middleware/db');

router.get('/', async (req, res) => {
    // get all genres
    const movies = await Movie.find().sort('title');

    // return the genres
    res.send(movies);
});

router.get('/:id', checkId, async (req, res) => {
    // get genre by id
    const movie = await Movie.findById(req.params.id);

    if (!movie)
        return res
            .status(404)
            .send('The Movie with the given ID was not found.');

    // return the genres
    res.send(movie);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = await Genre.findById(req.body.genreId);

    if (!genre)
        return res
            .status(404)
            .send('The genre with the given ID was not found.');

    let movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre.id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    movie = await movie.save();

    res.send(movie);
});

router.put('/:id', checkId, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = await Genre.findById(req.body.genreId);

    if (!genre)
        return res
            .status(404)
            .send('The genre with the given ID was not found.');

    // get customer by id
    let movie = await Movie.findById(req.params.id);

    if (!movie)
        return res
            .status(404)
            .send('The Movie with the given ID was not found.');

    movie.set({
        title: req.body.title,
        genre: {
            _id: genre.id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    movie = await movie.save();

    // return the customer
    res.send(movie);
});

module.exports = router;
