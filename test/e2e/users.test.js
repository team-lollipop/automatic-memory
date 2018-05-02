const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('User API', () => {

    before(() => dropCollection('tasks'));
    before(() => dropCollection('fluffs'));
    before(() => dropCollection('users'));

    const fluffs = [
        { desc: 'You arrive at a freeway.' },
        { desc: 'There is a wide river here.' },
        { desc: 'You find a tall dead tree.' }
    ];

    before(() => {
        fluffs.forEach(obj => {
            request.post('/api/fluffs')
                .send(obj)
                .then();
        });
    });

    let task1 = {
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
            .send(task1)
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
                user.id = body.userId;
            });
    });

    it('Adds item to inventory', () => {
        return request.post(`/api/users/${user.id}/inventory`)
            .send(task1.requiredItem)
            .then(({ body }) => {
                assert.deepEqual([task1.requiredItem.type], body.inventory);
            });
    });

    it('gets inventory', () => {
        return request.get(`/api/users/${user.id}/inventory`)
            .then(({ body }) => {
                assert.deepEqual([task1.requiredItem.type], body.inventory);
            });
    });

    it('gets an option (corresponding to one of 4 directions) and populates it with information', () => {
        const direction = 'n';
        return request.get(`/api/users/${user.id}/options/${direction}`)
            .then(({ body }) => {
                assert.ok(body.action);
                assert.ok(body.info);
            });
    });


    it('Deletes item to inventory', () => {
        return request.delete(`/api/users/${user.id}/inventory`)
            .then(({ body }) => {
                assert.deepEqual([], body.inventory);
            });
    });

    it('gets a user\'s current task number', () => {
        return request.get(`/api/users/${user.id}/level`)
            .then(({ body }) => {
                assert.isNumber(body.level);
            });
    });

    it('updates a user\'s current task number', () => {
        const task2 = {
            number: 2,
            startingDesc: 'Different desc.',
            requiredItem: { 
                type: 'something',
                itemDesc: 'Different desc.'
            },
            endpoint: {
                desc: 'Different desc.',
                unresolved: 'Nope, not yet.',
                resolved: 'Yay, you.'
            }
        };

        return request.post('/api/tasks')
            .send(task2)
            .then(({ body }) => {
                task2._id = body._id;
                return request.put(`/api/users/${user.id}/level`)
                    .send({ level: 2 });
            })
            .then(({ body }) => {
                assert.equal(body.currentTask, task2._id);
                assert.equal(body._id, user.id);

            });
    });

});