const { assert } = require('chai');
const request = require('./request');
// TODO: decide on auth for route
// TODO: add post?

describe('Fluff API', () => {
    it('gets 2 random fluffs', () => {
        return request.get('/api/fluffs')
            .then(({ body }) => {
                assert.strictEqual(body.length, 2);
                assert.ok(body[0].description);
                assert.ok(body[1].description);
            });
    });
});