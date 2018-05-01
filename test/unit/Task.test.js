const { assert } = require('chai');
const Task = require('../../lib/models/Task');
const { getErrors } = require('./helpers');

describe('Task model', () => {
    it('is a good, valid model', () => {
        const info = {
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

        const task = new Task(info);

        info._id = task._id;
        assert.deepEqual(task.toJSON(), info);
        assert.isUndefined(task.validateSync());
    });

    it('has required fields', () => {
        const invalidTask = new Task({});
        const errors = getErrors(invalidTask.validateSync(), 7);
        assert.strictEqual(errors.number.kind, 'required');
        assert.strictEqual(errors.explanation.kind, 'required');
        assert.strictEqual(errors['item.type'].kind, 'required');
        assert.strictEqual(errors['item.description'].kind, 'required');
        assert.strictEqual(errors['endpoint.description'].kind, 'required');
        assert.strictEqual(errors['endpoint.unresolved'].kind, 'required');
        assert.strictEqual(errors['endpoint.resolved'].kind, 'required');
    });
});