const router = require('express').Router();
const Fluff = require('../models/Fluff');

module.exports = router
    .post('/', (req, res, next) => {
        Fluff.create(req.body)
            .then(fluff => res.json(fluff))
            .catch(next);
    });