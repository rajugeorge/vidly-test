const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/genres', () => {
    let server;

    beforeEach(() => {
        server = require('../../index');
    });

    afterEach(async () => {
        await server.close();
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all the genres', async () => {
            const genres = await Genre.collection.insertMany([
                { name: 'genre 1' },
                { name: 'genre 2' }
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some((g) => g.name === 'genre 1')).toBeTruthy();
            expect(res.body.some((g) => g.name === 'genre 2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return the genre with id', async () => {
            const genre = new Genre({ name: 'genre 1' });
            await genre.save();
            const res = await request(server).get(`/api/genres/${genre._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 error with a invalid objectID', async () => {
            const genreId = '12345';
            const res = await request(server).get(`/api/genres/${genreId}`);
            expect(res.status).toBe(404);
        });
        it('should return 404 error with a valid objectID but missing genre', async () => {
            const genreId = mongoose.Types.ObjectId().toHexString();
            const res = await request(server).get(`/api/genres/${genreId}`);
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        let token;
        let name;

        beforeEach(() => {
            token = new User().generateToken();
        });

        const exec = () => {
            return request(server)
                .post(`/api/genres/`)
                .set('x-auth-token', token)
                .send({ name });
        };

        it('should return 400 if genre is less than 5 characters', async () => {
            name = 'hor';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is greater than 50 characters', async () => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre name is missing', async () => {
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 401 error if not authorized', async () => {
            name = 'Horror';
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 error if token is invalid', async () => {
            name = 'Horror';
            token =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTBiYzRmZTFhOWExMDAyZmZhZjZmYiIsImVtYWlsIjoidGVzdEBkZGRkYW5kdHJ1ZS5jb20iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2MjEyMzA5NDR9.chfAaVYqOvJvwWTVZHSGi44iGElwNmDEgzdpNAp3zBw';
            const res = await exec(1);
            expect(res.status).toBe(400);
        });

        it('should save genre to db', async () => {
            name = 'Horror';

            const res = await exec();

            const result = Genre.find({ name });
            expect(result).not.toBeNull();
        });

        it('should return genre saved to db', async () => {
            name = 'Horror';

            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
        });
    });

    describe('PUT /:id', () => {
        let token;
        let name;
        let id;

        beforeEach(() => {
            token = new User().generateToken();
        });

        const exec = () => {
            return request(server)
                .put(`/api/genres/${id}`)
                .set('x-auth-token', token)
                .send({ name });
        };

        it('should return 404 if id is missing', async () => {
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should return 400 if name length is less than 5', async () => {
            id = mongoose.Types.ObjectId().toHexString();
            name = 'hor';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if name length is greater than 50', async () => {
            id = mongoose.Types.ObjectId().toHexString();
            name = new Array(52).join('q');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if genre was not found', async () => {
            id = mongoose.Types.ObjectId().toHexString();
            name = 'Horror';

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return updated genre details', async () => {
            const genre = new Genre({ name: 'horror' });
            await genre.save();

            id = genre._id;
            name = 'Sci-Fi';

            const res = await exec();
            expect(res.body).toHaveProperty('name', name);
        });
    });
});
