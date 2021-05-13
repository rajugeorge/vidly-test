const { fizzBuzz } = require('../files/exercise1');

describe('fizzbuzz', () => {
    it('Throw error if the number is not defined', () => {
        expect(() => {
            fizzBuzz(null);
        }).toThrow();
    });
});
