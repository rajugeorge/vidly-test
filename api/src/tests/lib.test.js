const db = require('../files/db');
const lib = require('../files/lib');

describe('Absolute', () => {
    it('If the input is positive the output should be positive', () => {
        const result = lib.absolute(1);
        expect(result).toBe(1);
    });

    it('If the input is negative the output should be positive', () => {
        const result = lib.absolute(-1);
        expect(result).toBe(1);
    });

    it('If the input is zero the output should be zero', () => {
        const result = lib.absolute(0);
        expect(result).toBe(0);
    });
});

describe('greet', () => {
    it('Welcome the name', () => {
        const result = lib.greet('Raju');
        expect(result).toMatch(/Raju/);
    });
});

describe('getCurrencies', () => {
    it('Should return supported currencies', () => {
        const result = lib.getCurrencies();
        expect(result).toEqual(expect.arrayContaining(['EUR', 'USD', 'AUD']));
    });
});

describe('applyDiscount', () => {
    it('should apply discount if points is greater than 10', () => {
        //get customer details from db
        db.getCustomerSync = jest.fn().mockReturnValue({ id: 4, points: 11 });
        //create order
        const order = { customerId: 4, totalPrice: 10 };
        //apply discount.
        lib.applyDiscount(order);
        expect(order.totalPrice).toBe(9);
    });
});
