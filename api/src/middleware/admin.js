const checkAdmin = function (req, res, next) {
    if (!req.payload.isAdmin) return res.status(400).send('Not authorised');
    next();
};

exports.checkAdmin = checkAdmin;
