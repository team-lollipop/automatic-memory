const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
// TODO: decide on auth for route

describe('Task API', () => {

    before(() => dropCollection('tasks'));

    let info = {
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

    it('saves a task', () => {
        return request.post('/api/tasks')
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