const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');

const schema = new Schema({
    number: {
        type: Number,
        required: true
    },
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