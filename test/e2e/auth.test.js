const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Auth Api Test', () => {

    beforeEach(() => dropCollection('users'));

    let token = null;

    beforeEach(() => {
        return request.post('/api/auth/signup')
            .send({
                name: 'Master Blaster',
                password: 'bartertown'
            })
            .then(({ body }) => {
                token = body.token;
            });
    });

    it('signup route functional', () => {
        assert.ok(token);
    });

    it.skip('verify route is functional', () => {
        return request.get('/api/auth/verify')
            .set('Authorization', token)
            .then(({ body }) => {
                assert.ok(body.verified);
            });
    });

    it('signin route functional', () => {
        return request.post('/api/auth/signin')
            .send({
                name: 'Master Blaster',
                password: 'bartertown'
            })
            .then(({ body }) => {
                assert.ok(body.token);
            });
    });

});