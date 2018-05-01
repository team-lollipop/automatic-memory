const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Auth API', () => {

    beforeEach(() => dropCollection('users'));
    before(() => dropCollection('tasks'));

    let token = null;
    let user = null;

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

    beforeEach(() => {
        return request.post('/api/auth/signup')
            .send({
                name: 'Master Blaster',
                password: 'bartertown',
                currentTask: task._id
            })
            .then(({ body }) => {
                token = body.token;
                user = body.user;
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
    
    it('generates a set of game options for user', () => {
        assert.ok(user.options.n.description);
        assert.ok(user.options.s.description);
        assert.ok(user.options.e.description);
        assert.ok(user.options.w.description);
    });

});