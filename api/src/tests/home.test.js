const request = require('supertest');
let server;

describe('/', () => {
    beforeEach(async () => {
        const init = require('../init');
        server = await init();
    });
    afterEach(() => {
        server.close();
    });
    describe('GET /', () => {
        it('should return a status 200 and hello world text', async () => {
            const result = await request(server).get('/');
            expect(result.status).toBe(200);
        });
    });
});
