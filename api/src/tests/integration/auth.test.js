const request = require('supertest');
const { User } = require('../../models/user');
const { Genre } = require('../../models/genre');

describe('Authorization', () => {
    let server;
    let token;
    let name;

    beforeEach(() => {
        server = require('../../index');
        token = new User().generateToken();
    });

    afterEach(async () => {
        await server.close();
        await Genre.remove({});
    });

    const exec = () => {
        return request(server)
            .post(`/api/genres/`)
            .set('x-auth-token', token)
            .send({ name });
    };

    it('should return 401 error if not authorized', async () => {
        token = '';
        name = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 error if token is invalid', async () => {
        token = '12345';
        name = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
        name = 'Horror';
        const res = await exec();

        expect(res.status).toBe(200);
    });
});
