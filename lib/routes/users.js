const router = require('express').Router();
const User = require('../models/User');
const { updateOptions } = require('../util/mongoose-helpers');

// all of these should be using token user id, 
// not up to user to decide their id

module.exports = router
    .post('/inventory', (req, res, next) => {
        const { user, body } = req;

        User.findByIdAndUpdate(
            user.id,
            { $set: { inventory: [body.type] } },
            updateOptions
        )
            .then(user => {
                res.send({ inventory: user.inventory });
            })
            .catch(next);
    })
    
    .get('/inventory', (req, res, next) => {
        User.findById(req.user.id)
            .lean()
            .select('inventory')
            .then(user => {
                res.send({ inventory: user.inventory });
            })
            .catch(next);
    })
    
    .delete('/inventory', (req, res, next) => {
        User.findByIdAndUpdate(
            req.user.id,
            { $pop: { inventory: 1 } },
            updateOptions
        )
            .then(user => {
                res.send({ inventory: user.inventory });
            })
            .catch(next);
    })
    
    .get('/intro', (req, res, next) => {
        User.findById(req.user.id)
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

    .get('/level', (req, res, next) => {
        User.findById(req.user.id)
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

    .put('/level', (req, res, next) => {
        User.findById(req.user.id)
            .then(user => {
                return user.assignTask();
            })
            .then(user => user.save())
            .then(user => res.json(user))
            .catch(next);
    })

    .get('/options/:direction', ({ user, params }, res, next) => {
        const { direction } = params;
        
        let response = {};
    
        // I would have probably left the data more "structured" rather than try and
        // reduce to single "info". CLI has to do a switch/case anyway.

        User.findById(user.id)
            .lean()
            .select(`options.${direction}.action`)
            .then(user => {
                const action = user.options[direction].action;
                response.action = action;
                return action === 'look' ? populateFluff(user.id, direction) : populateTask(user.id, action);
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