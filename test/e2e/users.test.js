const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const User = require('../../lib/models/User');

describe('User routes', () => {

    before(() => dropCollection('tasks'));
    before(() => dropCollection('fluffs'));
    before(() => dropCollection('users'));

    let token = '';
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
        explanation: 'You begin to feel hungry. Better find some food.',
        item: { 
            type: 'walnut',
            description: 'You discover a walnut, but cannot crack the shell with your beak. You pick it up.'
        },
        endpoint: {
            description: 'You arrive at an intersection, crossed by telephone wires.',
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
        name: 'Joe',
        password: 'hello'
    };

    before(() => {
        return request.post('/api/auth/signup')
            .send(user)
            .then(({ body }) => {
                token = body.token;
                user.id = body.userId;
            });
    });
})