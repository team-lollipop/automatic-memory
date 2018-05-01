const router = require('express').Router();
const Task = require('../models/Task');

module.exports = router
    .post('/', (req, res, next) => {
        Task.create(req.body)
            .then(task => res.json(task))
            .catch(next);
    });