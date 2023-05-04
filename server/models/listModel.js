const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a list name!'],
        },
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

schema.virtual('jobs', {
    ref: 'job',
    foreignField: 'list',
    localField: '_id',
});

schema.pre(/^findOne/, function (next) {
    this.populate({
        path: 'jobs',
        select: '-__v',
    });
    next();
});

const ListModel = mongoose.model('list', schema);

module.exports = ListModel;
