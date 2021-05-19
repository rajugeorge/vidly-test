const express = require('express');
const { User, validate } = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');
const { checkAuth } = require('../middleware/auth');

router.get('/', async (req, res) => {
    // get all genres
    const users = await User.find();

    // return the genres
    res.send(users);
});

router.get('/me', checkAuth, async (req, res) => {
    // get all genres
    const payload = req.payload;
    const user = await User.findById(payload.id).select('-password');

    // return the genres
    res.send(user);
});

router.post('/register', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.find({ email: req.body.email });
    if (user.length > 0) return res.status(400).send('User exists');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    user = await new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        isAdmin: req.body.isAdmin
    });

    user = await user.save();

    const token = user.generateToken();

    res.header('x-auth-token', token).send(
        _.pick(user, ['_id', 'name', 'email'])
    );
});

module.exports = router;
