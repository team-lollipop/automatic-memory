const router = require('express').Router();
const Fluff = require('../models/Fluff');

module.exports = router
    .get('/', (req, res, next) => {
        Fluff.aggregate([
            {
                $sample: { size: 2 }
            },
            {
                $project: { _id: 0, description: 1 }
            }
        ])
            .then(fluffs => res.json(fluffs))
            .catch(next);
    });