const request = require('supertest');
const { Rental } = require('../../models/rental');
const { Movie } = require('../../models/movie');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
const moment = require('moment');

describe('/api/returns', () => {
    let server;
    let token;
    let customerId;
    let movieId;
    let rental;
    let movie;

    beforeEach(async () => {
        server = require('../../index');
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateToken();

        movie = new Movie({
            _id: movieId,
            title: 'King and Kong',
            genre: {
                name: 'Horror'
            },
            numberInStock: 10,
            dailyRentalRate: 2
        });

        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: 'One Customer',
                phone: '12345678'
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        });
        await rental.save();
    });

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId });
    };

    afterEach(async () => {
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });

    it('should return 401 if the user is not authorized', async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
        customerId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async () => {
        movieId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if rental is not found', async () => {
        await Rental.remove({});

        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 if rental is already processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if the request is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should set returnDate if the request is valid', async () => {
        const res = await exec();

        const rentalInDB = await Rental.findById(rental._id);

        expect(rentalInDB.dateReturned).toBeInstanceOf(Date);
    });

    it('should set the rentalFee if the request is valid', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();

        const rentalInDB = await Rental.findById(rental._id);

        expect(rentalInDB.rentalFee).toBe(14);
    });

    it('should increase the movie stock', async () => {
        //execute the rental endpoint
        const res = await exec();
        //get movie from db
        const movieInDB = await Movie.findById(movie._id);
        //assert that movie stock is equal to initial stock
        expect(movieInDB.numberInStock).toBe(11);
    });

    it('should return rental if the input is valid', async () => {
        //execute the rental endpoint
        const res = await exec();
        //assert that movie stock is equal to initial stock
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining([
                'customer',
                'movie',
                'dateOut',
                'dateReturned',
                'rentalFee'
            ])
        );
    });
});
