const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const { RequiredString } = require('../util/mongoose-helpers');
const shuffle = require('../util/shuffle');
const Fluff = require('./Fluff');
const Task = require('./Task');

const option = { 
    action: String, 
    fluff: { 
        type: Schema.Types.ObjectId, 
        ref: 'Fluff' 
    } 
};

const schema = new Schema({
    name: RequiredString,
    hash: RequiredString,
    inventory: [String],
    currentTask: {
        type: Schema.Types.ObjectId,
        ref: 'Task'
    },
    options: {
        n: option,
        s: option,
        e: option,
        w: option
    },
    roles: [String]
});

schema.methods = {
    
    generateHash(password) {
        this.hash = bcrypt.hashSync(password, 8);
    },

    comparePassword(password) {
        return bcrypt.compareSync(password, this.hash);
    },

    assignTask() {
        // calculate based on what you already know...
        const getNextNumber = this.currentTask 
            ? Task.findById(this.currentTask).lean().select('number')
                .then(({ number }) => number + 1)
            : Promise.resolve(1);

        return Promise.all([
            getNextNumber.then(number => Task.findOne({ number }).lean().select('_id')),
            Fluff.aggregate([
                { $sample: { size: 2 } }
            ])
        ])
            .then(([task, fluffs]) => {
                if(!task || fluffs.length === 0) return;
                this.currentTask = task._id;

                const dirs = ['n', 's', 'e', 'w'];
                const randomizedDirs = shuffle(dirs);
                this.options[randomizedDirs[0]] = { action: 'interact' };
                this.options[randomizedDirs[1]] = { action: 'resolve' };
                this.options[randomizedDirs[2]] = { action: 'look', fluff: fluffs[0]._id };
                this.options[randomizedDirs[3]] = { action: 'look', fluff: fluffs[1]._id };
            })
            // it's odd that "assignTask" wouldn't save, so go ahead and do it here:
            .then(() => this.save());
    }

};

module.exports = mongoose.model('User', schema);

