const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'An account must have an email!'],
        unique: [true, 'Email already exists!'],
        validate: [
            validator.isEmail,
            'Please enter a valid email address!',
        ],
    },
    password: {
        type: String,
        required: [true, 'An account must have a password!'],
        minLength: [
            8,
            "'Password's length must between 8 and 16 characters.",
        ],
        maxLength: [
            16,
            "'Password's length must between 8 and 16 characters.",
        ],
        validate: {
            validator: function (val) {
                return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{0,}$/.test(
                    val
                );
            },
            message:
                'Password must include at least 1 letter and 1 number.',
        },
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password!'],
        validate: {
            validator: function (val) {
                return val === this.password;
            },
            message: 'Password is not the same!',
        },
    },
    //Type: name#randomIntegerWith4Characters
    //randomInt will be executed and the account name will be unique.
    accountName: {
        type: String,
        required: [true, 'Please enter your account name!'],
    },
    photo: {
        type: String,
        default: '/default.png',
    },
    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

schema.index({ accountName: 1, email: 1 }, { unique: true });

schema.methods.correctPassword = async (userPassword, hash) =>
    bcrypt.compare(userPassword, hash);

schema.methods.changedPassword = function (iat) {
    if (this.passwordChangedAt) {
        const changedTime = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return iat < changedTime;
    }
    return false;
};

schema.methods.generateToken = function () {
    const token = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    console.log(
        { tokenAfterHash: this.resetPasswordToken },
        token
    );
    return token;
};

schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

const UserModel = mongoose.model('user', schema);

module.exports = UserModel;
