const router = require('express').Router();
const User = require('../models/User');
const Task = require('../models/Task');


module.exports = router

    .get('/:id/intro', (req, res, next) => {
        const { id } = req.params;
    
        Promise.all([
            User.findById(id)
                .lean(),

            Task.find({ 'currentTask': id })
                .lean()
        ])
            .then(([user, task]) => {
                user.currentTask = task;
                res.json(user);
            })
            .catch(next);

    });