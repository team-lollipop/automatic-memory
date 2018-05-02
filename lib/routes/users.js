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
        User.findById(req.params.id)
            .lean()
            .select('currentTask')
            .populate({
                path: 'currentTask',
                select: 'startingDesc'
            })
            .then(user => {
                res.json({ intro: user.currentTask.startingDesc });
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
        
        let response = {};
    
        User.findById(id)
            .lean()
            .select(`options.${direction}.action`)
            .then(user => {
                const action = user.options[direction].action;
                response.action = action;
                return action === 'look' ? populateFluff(id, direction) : populateTask(id, action);
            })
            .then(info => {
                response.info = info;
                res.json(response);
            })
            .catch(next);
    });

function populateFluff(id, direction) {
    return User.findById(id)
        .lean()
        .select(`options.${direction}.action`)
        .populate(`options.${direction}.fluff`)
        .then(user => {
            return user.options[direction].fluff.desc;
        });
}

function populateTask(id, action) {
    return User.findById(id)
        .lean()
        .select('currentTask')
        .populate('currentTask')
        .then(user => {
            if(action === 'interact') {
                return user.currentTask.requiredItem;
            } else {
                user.currentTask.endpoint.requiredItem = user.currentTask.requiredItem.type;
                return user.currentTask.endpoint;
            }
        });
}