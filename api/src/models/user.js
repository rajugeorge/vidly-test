const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const winston = require('winston');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

schema.methods.generateToken = function () {
    const payload = {
        _id: this._id,
        email: this.email,
        isAdmin: this.isAdmin
    };

    return jwt.sign(payload, config.get('authentication.jwtkey'));
};

const User = mongoose.model('User', schema);

function validate(input) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean()
    });
    return schema.validate(input);
}

exports.User = User;
exports.validate = validate;
