const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const User = require('../../lib/models/User');

describe('Auth API', () => {

    before(() => dropCollection('tasks'));
    before(() => dropCollection('fluffs'));
    beforeEach(() => dropCollection('users'));

    let token = null;

    const fluffs = [
        { description : 'You arrive at a freeway.' },
        { description : 'There is a wide river here.' },
        { description : 'You find a tall dead tree.' }
    ];

    before(() => {
        fluffs.forEach(obj => {
            request.post('/api/fluffs')
                .send(obj)
                .then();
        });
    });

    let task = {
        number: 1,
        startingDesc: 'You begin to feel hungry. Better find some food.',
        requiredItem: { 
            type: 'walnut',
            itemDesc: 'You discover a walnut, but cannot crack the shell with your beak. You pick it up.'
        },
        endpoint: {
            desc: 'You arrive at an intersection, crossed by telephone wires.',
            unresolved: 'If you needed to crack something, this would be a good spot for it.',
            resolved: 'You drop the walnut onto the street. A car rolls over it, cracking the shell, and you carefully swoop down and devour the food inside.'
        }
    };

    before(() => {
        return request.post('/api/tasks')
            .send(task)
            .then(({ _id }) => {
                task._id = _id;
            });
    });

    let user = {
        name: 'Master Blaster',
        password: 'bartertown',
    };

    beforeEach(() => {
        return request.post('/api/auth/signup')
            .send(user)
            .then(({ body }) => {
                token = body.token;
                user.id = body.userId;
            });
    });

    it('signup route functional', () => {
        assert.ok(token);
    });

    it('verify route functional', () => {
        return request.get('/api/auth/verify')
            .set('Authorization', token)
            .then(({ body }) => {
                assert.ok(body.verified);
            });
    });

    it('signin route functional', () => {
        return request.post('/api/auth/signin')
            .send({
                name: 'Master Blaster',
                password: 'bartertown'
            })
            .then(({ body }) => {
                assert.ok(body.token);
            });
    });
    
    it('assigns user a task and generates a set of game options for user', () => {
        return User.findById(user.id)
            .then(user => {
                assert.ok(user.currentTask);
                assert.ok(user.options.n.action);
                assert.ok(user.options.s.action);
                assert.ok(user.options.e.action);
                assert.ok(user.options.w.action);
            });
    });

});