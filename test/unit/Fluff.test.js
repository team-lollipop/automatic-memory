const { assert } = require('chai');
const Fluff = require('../../lib/models/Fluff');
const { getErrors } = require('./helpers');

describe('Fluff model', () => {

    it('is a good, valid model', () => {
        const info = {
            desc: 'You arrive at a freeway.'
        };

        const fluff = new Fluff(info);
        info._id = fluff._id;
        assert.deepEqual(fluff.toJSON(), info);
        assert.isUndefined(fluff.validateSync());
    });

    it('has required fields', () => {
        const invalidFluff = new Fluff({});
        const errors = getErrors(invalidFluff.validateSync(), 1);
        assert.strictEqual(errors.desc.kind, 'required');
    });

});