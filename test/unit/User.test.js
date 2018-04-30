const { assert } = require('chai');
const User = require('../../lib/models/User');
const { getErrors } = require('./helpers');

describe('User model', () => {

    it('good valid model', () => {
        const input = {
            name: 'Tasha Zuniga',
            hash: 'Thisispassword',

        };
        const user = new User(input);
        input._id = user._id;
        assert.deepEqual(user.toJSON(), input);
    });


});