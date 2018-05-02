const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const User = require('../../lib/models/User');

describe('Auth API', () => {

    before(() => dropCollection('tasks'));
    before(() => dropCollection('fluffs'));
    before(() => dropCollection('users'));
    
    const adminUser = {
        name: 'Tina Turner',
        password: 'Tommy',
        roles: ['admin']
    };
    
    let adminToken = null;
    
    before(() => {
        return request.post('/api/auth/signup')
            .send(adminUser)
            .then(({ body }) => {
                adminToken = body.token;
                adminUser.id = body.userId;
            });
    });

    let token = null;

    const fluffs = [
        { desc: 'You arrive at a freeway.' },
        { desc: 'There is a wide river here.' },
        { desc: 'You find a tall dead tree.' }
    ];

    before(() => {
        fluffs.forEach(obj => {
            request.post('/api/fluffs')
                .set('Authorization', adminToken)
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
            .set('Authorization', adminToken)
            .send(task)
            .then();
    });

    let user = {
        name: 'Master Blaster',
        password: 'bartertown',
    };

    before(() => {
        return request.post('/api/auth/signup')
            .send(user)
            .then(({ body }) => {
                token = body.token;
                user.id = body.userId;
            });
    });

    it('has a functional signup route', () => {
        assert.ok(token);
    });

    it('has a functional verify route', () => {
        return request.get('/api/auth/verify')
            .set('Authorization', token)
            .then(({ body }) => {
                assert.ok(body.verified);
            });
    });

    it('has a functional signin route', () => {
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