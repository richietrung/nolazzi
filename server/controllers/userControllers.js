const multer = require('multer');
const sharp = require('sharp');

const UserModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/../assets/imgs/users`);
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user._id}-avatar.${ext}`);
    },
});

const fileFilter = function (req, file, cb) {
    if (
        ['jpeg', 'jpg', 'png'].includes(
            file.mimetype.split('/')[1]
        )
    ) {
        return cb(null, true);
    }
    return cb(new AppError('Invalid file format!', 400));
};

const upload = multer({
    storage: multerStorage,
    fileFilter: fileFilter,
});

//For admin
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json({
        status: 'success',
        data: {
            users,
        },
    });
});

exports.createUser = catchAsync(async (req, res, next) => {
    await UserModel.create({
        email: req.body.email,
        accountName: req.body.accountName,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    });
    res.status(200).json({
        status: 'success',
    });
});

exports.uploadUserPhoto = upload.single('photo');

const filterObject = (obj, keepArr) => {
    const newObj = {};
    keepArr.forEach((el) => {
        newObj[el] = obj[el];
    });
    return newObj;
};

exports.updateUserData = catchAsync(async (req, res, next) => {
    if (req.password || req.confirmPassword) {
        return next(
            new AppError(
                'You cannot update your password here. Please go to update password route for this action!',
                400
            )
        );
    }
    if (!req.body.email && !req.body.accountName && !req.file) {
        return next(
            new AppError('You did not update your account!', 400)
        );
    }
    const filteredBody = filterObject(req.body, [
        'email',
        'accountName',
    ]);
    let buffer;
    if (req.file)
        buffer = await sharp(req.file.path)
            .resize(500, 500)
            .toBuffer();
    await sharp(buffer)
        .toFormat('jpeg')
        .jpeg({ quality: 100 })
        .toFile(`assets/imgs/users/${req.file.filename}`, {
            overwrite: true,
        });
    filteredBody.photo = `/imgs/users/${req.file.filename}`;
    await UserModel.findByIdAndUpdate(
        req.user._id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );
    res.status(200).json({ status: 'success' });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = req.user;
    user.password = undefined;
    res.status(200).json({
        status: 'success',
        user,
    });
});
