const express = require('express');
const { Genre, validate } = require('../models/genre');
const router = express.Router();
const { checkId } = require('../middleware/db');
const { checkAuth } = require('../middleware/auth');
const { checkAdmin } = require('../middleware/admin');

router.get('/', async (req, res) => {
    // get all genres
    const genres = await Genre.find().sort('name');
    // return the genres
    res.status(200).send(genres);
});

router.get('/:id', checkId, async (req, res) => {
    // get genre by id
    const genre = await Genre.findById(req.params.id);

    if (!genre)
        return res
            .status(404)
            .send('The genre with the given ID was not found.');

    // return the genres
    res.send(genre);
});

router.post('/', checkAuth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ ...req.body });
    genre = await genre.save();

    res.send(genre);
});

router.put('/:id', checkId, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // get genre by id
    let genre = await Genre.findById(req.params.id);

    if (!genre)
        return res
            .status(404)
            .send('The genre with the given ID was not found.');

    genre.set({ ...req.body });

    genre = await genre.save();

    // return the genres
    res.send(genre);
});

module.exports = router;
