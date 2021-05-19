const mongoose = require('mongoose');
const Joi = require('joi');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minglength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', schema);

function validate(input) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required()
    });
    return schema.validate(input);
}

exports.Genre = Genre;
exports.validate = validate;
exports.genreSchema = schema;
