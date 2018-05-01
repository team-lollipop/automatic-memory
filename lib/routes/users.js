const router = require('express').Router();
const User = require('../models/User');
const { updateOptions } = require('../util/mongoose-helpers');


module.exports = router
    .post('/:id/inventory', (req, res, next) => {
        const { id } = req.params;
        const { body } = req;

        User.findByIdAndUpdate(
            id,
            { $set: { inventory: [body.type] } },
            updateOptions
        )
            .then(user => {
                res.send({ inventory: user.inventory });
            })
            .catch(next);
    });