const express = require('express');
const { Customer, validate } = require('../models/customer');
const router = express.Router();
const { checkId } = require('../middleware/db');

router.get('/', async (req, res) => {
    // get all genres
    const customers = await Customer.find().sort('name');

    // return the genres
    res.send(customers);
});

router.get('/:id', checkId, async (req, res) => {
    // get genre by id
    const customer = await Customer.findById(req.params.id);

    if (!customer)
        return res
            .status(404)
            .send('The Customer with the given ID was not found.');

    // return the genres
    res.send(customer);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({ ...req.body });
    customer = await customer.save();

    res.send(customer);
});

router.put('/:id', checkId, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // get customer by id
    let customer = await Customer.findById(req.params.id);

    if (!customer)
        return res
            .status(404)
            .send('The Customer with the given ID was not found.');

    customer.set({ ...req.body });

    customer = await customer.save();

    // return the customer
    res.send(customer);
});

module.exports = router;
