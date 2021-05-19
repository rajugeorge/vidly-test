const mongoose = require('mongoose');

const checkId = function (req, res, next) {
    const result = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!result) return res.status(404).send('Invalid Id');

    next();
};

exports.checkId = checkId;
