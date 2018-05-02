const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Fluff API', () => {
    
    before(() => dropCollection('fluffs'));
    before(() => dropCollection('users'));
    
    const adminUser = {
        name: 'Tina Turner',
        password: 'Tommy',
        roles: ['admin']
    };
    
    let adminToken = null;
    
    before(() => {
        return request.post('/api/auth/signup')
            .send(adminUser)
            .then(({ body }) => {
                adminToken = body.token;
                adminUser.id = body.userId;
            });
    });

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