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


});