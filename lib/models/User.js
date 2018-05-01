const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const { RequiredString } = require('../util/mongoose-helpers');
const shuffle = require('../util/shuffle');
const Fluff = require('./Fluff');
const Task = require('./Task');

const schema = new Schema({
    name: RequiredString,
    hash: RequiredString,
    inventory: [String],
    currentTask: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    options: {
        n: { description: RequiredString },
        s: { description: RequiredString },
        e: { description: RequiredString },
        w: { description: RequiredString }
    }
});

schema.methods = {
    generateHash(password) {
        this.hash = bcrypt.hashSync(password, 8);
    },

    comparePassword(password) {
        return bcrypt.compareSync(password, this.hash);
    },

    assignTask(number) {
        return Promise.all([
            Task.findOne({ number: number }),
            Fluff.aggregate([
                { $sample: { size: 2 } },
                { $project: { _id: 0, description: 1 } }
            ])
        ])
            .then(([task, fluffs]) => {
                this.currentTask = task._id;

                const dir = ['n', 's', 'e', 'w'];
                const randomizedDir = shuffle(dir);
                this.options[randomizedDir[0]] = task.item;
                this.options[randomizedDir[1]] = task.endpoint;
                this.options[randomizedDir[2]] = fluffs[0];
                this.options[randomizedDir[3]] = fluffs[1];
            });
    }

};

module.exports = mongoose.model('User', schema);

