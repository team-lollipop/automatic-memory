const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

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
                token = body.token;
                user.options = body.options;
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
        // TODO add user routes (i.e. GET one) and use instead of returning options
        assert.ok(user.currentTask);
        assert.ok(user.options.n.description);
        assert.ok(user.options.s.description);
        assert.ok(user.options.e.description);
        assert.ok(user.options.w.description);
    });

});