const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        unique: true,
        ref: 'user',
    },
    refreshToken: {
        type: String,
        required: true,
    },
});

const RefreshToken = mongoose.model('refreshToken', schema);

module.exports = RefreshToken;
