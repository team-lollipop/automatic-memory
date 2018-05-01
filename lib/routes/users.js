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

    })
 
  .get('/:id/directions/:direction', (req, res, next) => {
        const { id, direction } = req.params;
        const optionPath = `options.${direction}.action`;
        
        let response = {};
    
        User.findById(id)
            .lean()
            .select(optionPath)
            .then(user => {
                const action = user.options[direction].action;
                response.action = action;
                return action === 'look' ? populateFluff(id, direction, optionPath) : populateTask(id, action);
            })
            .then(info => {
                response.info = info;
                res.json(response);
            })
            .catch(next);
    });

function populateFluff(id, direction, selectPath) {
    const fluffPath = `options.${direction}.fluff`;
    
    return User.findById(id)
        .lean()
        .select(selectPath)
        .populate(fluffPath)
        .then(user => {
            return user.options[direction].fluff.description;
        });
}

function populateTask(id, action) {
    return User.findById(id)
        .lean()
        .select('currentTask')
        .populate('currentTask')
        .then(user => {
            return action === 'interact' ? user.currentTask.item : user.currentTask.endpoint;
        });
}