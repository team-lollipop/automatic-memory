const router = require('express').Router();
const User = require('../models/User');
const { updateOptions } = require('../util/mongoose-helpers');
const Task = require('../models/Task');

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
    })
    
    .get('/:id/inventory', (req, res, next) => {
        const { id } = req.params;

        User.findById(id)
            .lean()
            .select('inventory')
            .then(user => {
                res.send({ inventory: user.inventory });
            })
            .catch(next);
    })

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

    .get('/:id/level', (req, res, next) => {
        User.findById(req.params.id)
            .lean()
            .select('currentTask')
            .populate({
                path: 'currentTask',
                select: 'number'
            })
            .then(user => {
                const level = user.currentTask.number;
                res.json({ level: level });
            })
            .catch(next);
    })

    .put('/:id/level', (req, res, next) => {
        User.findById(req.params.id)
            .then(user => {
                return user.assignTask(req.body.level);
            })
            .then(user => user.save())
            .then(user => res.json(user))
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
            return action === 'interact' ? user.currentTask.requiredItem : user.currentTask.endpoint;
        });
}