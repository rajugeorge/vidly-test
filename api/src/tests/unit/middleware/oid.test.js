const { checkId } = require('../../../middleware/db');
const mongoose = require('mongoose');

describe('Checking Objectid', () => {
    it('should not call next function if id is invalid', () => {
        const req = {
            params: {
                id: 'eeeee'
            }
        };
        const res = {
            status: jest.fn().mockReturnValue({ send: jest.fn() })
        };
        const next = jest.fn();
        checkId(req, res, next);
        expect(next).not.toHaveBeenCalled();
    });
});
