const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Task API', () => {

    before(() => dropCollection('tasks'));
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

    let info = {
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

    it('saves a task', () => {
        return request.post('/api/tasks')
            .set('Authorization', adminToken)
            .send(info)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.strictEqual(__v, 0);
                assert.deepEqual(body, {
                    ...info,
                    _id,
                    __v
                });
            });
    });
});