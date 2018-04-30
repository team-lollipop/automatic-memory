const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');

const schema = new Schema({
    description: RequiredString
});

module.exports = mongoose.model('Fluff', schema);