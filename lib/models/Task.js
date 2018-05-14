const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString, RequiredNumber } = require('../util/mongoose-helpers');

const schema = new Schema({
    // might as well do this for number...
    number: RequiredNumber,
    startingDesc: RequiredString,
    requiredItem: { 
        type: RequiredString,
        itemDesc: RequiredString
    },
    endpoint: {
        desc: RequiredString,
        unresolved: RequiredString,
        resolved: RequiredString
    }
});

module.exports = mongoose.model('Task', schema);