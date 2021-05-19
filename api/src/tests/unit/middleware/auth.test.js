const { checkAuth } = require('../../../middleware/auth');
const { User } = require('../../../models/user');
const mongoose = require('mongoose');

describe('Authorization middleware', () => {
    it('should set the req object with payload', async () => {
        const user = {
            _id: mongoose.Types.ObjectId().toHexString(),
            email: 'test@donefor.com',
            isAdmin: true
        };
        const token = new User(user).generateToken();
        const req = {
            header: jest.fn().mockReturnValue(token)
        };
        const next = jest.fn();
        const res = {};
        checkAuth(req, res, next);
        expect(req.payload).toMatchObject(user);
    });
});
