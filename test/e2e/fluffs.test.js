const { assert } = require('chai');
const request = require('./request');
// TODO: decide on auth for route

describe('Fluff API', () => {
    const info = {
        description : 'You arrive at a freeway.'
    };

    it('saves a bit of fluff', () => {
        return request.post('/api/fluffs')
            .send(info)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.strictEqual(__v, 0);
                assert.deepEqual(body, {
                    ...info,
                    _id,
                    __v
                });
            });
    });
});