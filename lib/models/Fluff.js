const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('../util/mongoose-helpers');

const schema = new Schema({
    desc: RequiredString
});

module.exports = mongoose.model('Fluff', schema);