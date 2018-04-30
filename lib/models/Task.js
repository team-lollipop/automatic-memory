const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');

const schema = new Schema({
    explanation: RequiredString,
    item: { 
        type: RequiredString,
        description: RequiredString
    },
    endpoint: {
        description: RequiredString,
        unresolved: RequiredString,
        resolved: RequiredString
    }
});

module.exports = mongoose.model('Task', schema);