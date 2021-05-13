const express = require('express');
const { Genre, validate } = require('../models/genre');
const router = express.Router();

router.get('/', async (req, res) => {
    res.status(200).send('TODO : get all genres');
});

router.get('/:id', async (req, res) => {
    res.status(200).send(`TODO : get genre by id : ${req.params.id}`);
});

router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let genre = new Genre({ ...req.body });
        genre = await genre.save();

        res.send(genre);
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});

router.put('/:id', async (req, res) => {
    res.status(200).send(`TODO : update genre : ${req.params.id}`);
});

module.exports = router;
