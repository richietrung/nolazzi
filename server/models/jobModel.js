const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a job name!'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    description: String,
    flag: {
        type: Boolean,
        default: false,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    remindTime: {
        type: String,
        validate: {
            validator: function (val) {
                return /(^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$)|()/g.test(
                    val
                );
            },
            message: 'Provide time with HH:MM format',
        },
    },
    remindDate: Date,
    repeat: {
        type: String,
        enum: {
            values: ['never', 'daily', 'weekly', 'monthly'],
            message:
                "Must be either 'never', 'daily', 'weekly', 'monthly'",
        },
        default: 'never',
    },
    priority: {
        type: String,
        enum: {
            values: ['none', 'low', 'medium', 'high'],
            message:
                "Must be either 'none', 'low', 'medium', 'high'",
        },
        default: 'none',
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: [true, 'A job must belong to a user!'],
    },
    list: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'list',
    },
});

schema.pre(/^find/, function (next) {
    this.populate({ path: 'list', select: 'name _id' });
    next();
});

const JobModel = mongoose.model('job', schema);

module.exports = JobModel;
