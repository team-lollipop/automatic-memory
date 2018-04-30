const { assert } = require('chai');
const Fluff = require('../../lib/models/Fluff');
// const { getErrors } = require('./helpers');

describe('Fluff model', () => {

    it('is a good, valid model', () => {
        const info = {
            description: 'You arrive at a freeway.'
        };

        const fluff = new Fluff(info);
        info._id = fluff._id;
        assert.deepEqual(fluff.toJSON(), info);
        assert.isUndefined(fluff.validateSync());
    });

    // TODO: test required

});