const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');

const UserModel = require('../models/userModel');
const RefreshToken = require('../models/refreshToken');
const catchAsync = require('../utils/catchAsync');
const Mail = require('../utils/sendMail');
const AppError = require('../utils/appError');

const resWithToken = async (user, res) => {
    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '7d' }
    );
    const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '10m' }
    );
    await RefreshToken.deleteOne({ user: user.id });
    await RefreshToken.create({
        user: user.id,
        refreshToken,
    });
    res.cookie('jwt', accessToken, {
        secure: process.env.NODE_ENV !== 'development',
        httpOnly: true,
        expires: new Date(Date.now() + 10 * 60 * 1000),
    });
    res.cookie('refreshJWT', refreshToken, {
        secure: process.env.NODE_ENV !== 'development',
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    const userFiltered = {
        email: user.email,
        username: user.username,
    };
    res.status(200).json({
        status: 'success',
        refreshToken,
        accessToken,
        data: {
            user: userFiltered,
        },
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const info = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        accountName: req.body.accountName,
    };
    const user = await UserModel.create(info);
    resWithToken(user, res);
});

exports.login = catchAsync(async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return next(
            new AppError(
                'Please enter your email and password!'
            ),
            400
        );
    }
    const user = await UserModel.findOne({
        email: req.body.email,
    });
    if (!user) return next(new AppError('Invalid email', 401));
    if (
        !(await user.correctPassword(
            req.body.password,
            user.password
        ))
    )
        return next(new AppError('Incorrect password!', 401));
    resWithToken(user, res);
});

exports.logout = catchAsync(async (req, res, next) => {
    res.clearCookie('jwt');
    res.clearCookie('refreshJWT');
    res.status(200).json({
        status: 'Logged out',
    });
});

exports.protected = catchAsync(async (req, res, next) => {
    let token;
    const authorization = req.headers.authorization;
    if (authorization && authorization.startsWith('Bearer ')) {
        token = authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(
            new AppError(
                "You didn't log in, please log in to continue!",
                401
            )
        );
    }
    const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET_KEY
    );
    const currentUser = await UserModel.findById(decoded.id);
    if (!currentUser)
        return next(new AppError('No user found!', 400));
    if (currentUser.changedPassword(decoded.iat)) {
        return next(
            new AppError(
                'This account has changed password!',
                401
            )
        );
    }
    req.user = currentUser;
    next();
});

exports.refreshToken = catchAsync(async (req, res, next) => {
    const refreshToken = req.cookies.refreshJWT;
    if (!refreshToken) {
        return next(new AppError('Access denied!', 401));
    }
    const token = await RefreshToken.findOne({
        refreshToken,
    }).populate({
        path: 'user',
        select: '-password',
    });
    if (!token) {
        return next(new AppError('Invalid token!', 401));
    }
    jwt.verify(
        token.refreshToken,
        process.env.JWT_SECRET_KEY,
        async (err) => {
            if (err) {
                await RefreshToken.findOneAndDelete({
                    refreshToken: refreshToken,
                });
                return next(new AppError('Access denied!', 401));
            }
            const accessToken = jwt.sign(
                { id: token.user._id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '10m' }
            );
            res.cookie('jwt', accessToken, {
                secure: process.env.NODE_ENV !== 'development',
                httpOnly: true,
                expires: new Date(Date.now() + 10 * 60 * 1000),
            });
            res.status(200).json({
                status: 'success',
                accessToken,
            });
        }
    );
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword, confirmNewPassword } =
        req.body;
    const user = req.user;
    if (
        !currentPassword ||
        !newPassword ||
        !confirmNewPassword
    ) {
        return next(
            new AppError(
                'Please provide current password, new password and confirm it!',
                400
            )
        );
    }
    if (
        !(await user.correctPassword(
            currentPassword,
            user.password
        ))
    ) {
        return next(new AppError('Wrong password!', 401));
    }
    if (currentPassword === newPassword) {
        return next(
            new AppError(
                "New password can't be the same as current password!",
                400
            )
        );
    }
    user.password = newPassword;
    user.confirmPassword = confirmNewPassword;
    user.save({ validateBeforeSave: true });
    res.status(200).json({
        status: 'success',
    });
});

exports.forgotPassword = async (req, res, next) => {
    if (!req.body.email || !req.body.clientURL)
        return next(
            new AppError(
                'Please enter email and client url!',
                400
            )
        );
    const user = await UserModel.findOne({
        email: req.body.email,
    });
    if (!user) return next(new AppError('No user found!', 404));
    const token = user.generateToken();
    const url = `${req.protocol}://${req.get(
        'host'
    )}/api/nolazzi/users/resetPassword/${token}`;
    const clientURL = `${req.body.clientURL}/${token}`;
    try {
        await new Mail(user, clientURL).sendResetPassword();
        user.save({ validateBeforeSave: false });
        res.status(200).json({ status: 'success', url });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(404).json({ status: 'fail' });
    }
};

exports.resetPasswordWithEmail = catchAsync(
    async (req, res, next) => {
        const token = req.params.token;
        const hashToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        const user = await UserModel.findOne({
            resetPasswordToken: hashToken,
            resetPasswordExpires: { $gte: Date.now() },
        });
        if (!user) {
            return next(
                new AppError('This link is expired!', 404)
            );
        }
        if (req.body.password !== req.body.confirmPassword) {
            return next(
                new AppError('Password is not the same!', 404)
            );
        }
        if (
            await user.correctPassword(
                req.body.password,
                user.password
            )
        ) {
            return next(
                new AppError(
                    'You new password is the same as the old!',
                    404
                )
            );
        }
        user.resetPasswordExpires = undefined;
        user.resetPasswordToken = undefined;
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        await user.save();
        res.status(200).json({
            status: 'success',
        });
    }
);
