const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('User API', () => {

    before(() => dropCollection('tasks'));
    before(() => dropCollection('fluffs'));
    beforeEach(() => dropCollection('users'));

    // let token = null;

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
        name: 'Master Blaster',
        password: 'bartertown',
    };

    beforeEach(() => {
        return request.post('/api/auth/signup')
            .send(user)
            .then(({ body }) => {
                // token = body.token;
                user.id = body.userId;
            });
    });

    it('gets an option (corresponding to one of 4 directions) and populates it with information', () => {
        const direction = 'n';
        return request.get(`/api/users/${user.id}/directions/${direction}`)
            .then(({ body }) => {
                assert.ok(body.action);
                assert.ok(body.info);
            });
    });

});