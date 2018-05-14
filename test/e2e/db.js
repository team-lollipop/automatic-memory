const connect = require('../../lib/util/connect');
const mongoose = require('mongoose');
const User = require('../../lib/models/User');
const { sign } = require('../../lib/util/token-service');

before(() => connect('mongodb://localhost:27017/bird-game-test'));
after(() => mongoose.connection.close());

module.exports = {
    dropCollection(name) {
        return mongoose.connection.dropCollection(name)
            .catch(err => {
                if(err.codeName !== 'NamespaceNotFound') throw err;
            });
    },

    // use the model and token service here so you can set role (w/o exposing in route)!

    // createAdminToken(info = { name: 'Administrator', password: '12345', roles: ['admin'] }) {
    //     return request.post('/api/auth/signup')
    //         .send(info)
    //         .then(({ body }) => body.token);
    // }

    createAdminToken(info = { name: 'Administrator', password: '12345', roles: ['admin'] }) {
        const user = new User(info);
        user.generatePassword(info.password);
        return user.save().then(sign);
    }
};