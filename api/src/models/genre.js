const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Genre = mongoose.model('Genre', schema);

function validate(input) {
    const schema = Joi.object({
        name: Joi.String().required()
    });
    return Joi.validate(input, schema);
}

exports.Genre = Genre;
exports.validate = validate;
