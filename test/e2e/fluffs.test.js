const { assert } = require('chai');
const request = require('./request');
const { dropCollection, createAdminToken } = require('./db');

describe('Fluff API', () => {
    
    before(() => dropCollection('fluffs'));
    before(() => dropCollection('users'));
    
    let adminToken = '';
    before(() => createAdminToken().then(t => adminToken = t));

    const info = {
        desc: 'You arrive at a freeway.'
    };

    it('saves a bit of fluff', () => {
        return request.post('/api/fluffs')
            .set('Authorization', adminToken)
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