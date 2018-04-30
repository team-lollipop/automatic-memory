const router = require('express').Router();
const User = require('../models/User');
const { sign } = require('../util/token-service');

module.exports = router
    .post('/signup', (req, res, next) => {
        const { body } = req;
        const { name, password } = body;
        delete body.password;

        User.find({ name })
            .count()
            .then(count => {
                if(count) throw {
                    status: 400,
                    error: 'This name is already taken'
                };
                const user = new User({ name });
                user.generateHash(password);
                return user.save();
            })
            .then(user => {
                res.json({ token: sign(user) });
            })
            .catch(next);
    });