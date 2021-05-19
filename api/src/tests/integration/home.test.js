const request = require('supertest');

describe('/', () => {
    let server;

    beforeEach(() => {
        server = require('../../index');
    });
    afterEach(async () => {
        await server.close();
    });
    describe('GET /', () => {
        it('should return a status 200 and hello world text', async () => {
            const res = await request(server).get('/');
            expect(res.status).toBe(200);
        });
    });
});
