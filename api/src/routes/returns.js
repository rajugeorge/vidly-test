const Joi = require('joi');
const validate = require('../middleware/validate');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { checkAuth } = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/', [checkAuth, validate(validateReturn)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if (!rental) return res.status(404).send('Rental not found');

    if (rental.dateReturned)
        return res.status(400).send('Rental already processed');

    rental.return();
    await rental.save();

    await Movie.updateOne(
        { _id: rental.movie._id },
        {
            $inc: { numberInStock: 1 }
        }
    );

    return res.status(200).send(rental);
});

function validateReturn(input) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });

    return schema.validate(input);
}

module.exports = router;
