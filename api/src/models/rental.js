const mongoose = require('mongoose');
const { genreSchema } = require('./genre');
const Joi = require('joi');

const schema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

schema.statics.lookup = function (customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
};

schema.methods.return = function () {
    this.dateReturned = new Date();
    const days =
        (this.dateReturned.getTime() - this.dateOut.getTime()) /
        (1000 * 3600 * 24);

    this.rentalFee = Math.floor(days) * this.movie.dailyRentalRate;
};

const Rental = mongoose.model('Rental', schema);

function validate(input) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });

    return schema.validate(input);
}

exports.Rental = Rental;
exports.validate = validate;
