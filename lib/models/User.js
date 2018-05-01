const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const { RequiredString } = require('../util/mongoose-helpers');

const schema = new Schema({
    name: RequiredString,
    hash: RequiredString,
});

schema.methods = {
    generateHash(password) {
        this.hash = bcrypt.hashSync(password, 8);
    },

    comparePassword(password) {
        return bcrypt.compareSync(password, this.hash);
    }
};

module.exports = mongoose.model('User', schema);

