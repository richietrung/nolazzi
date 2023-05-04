const AppError = require('../utils/appError');

const resDevEnv = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        err: err,
        stack: err.stack,
    });
};

const resProdEnv = (res, err) => {
    if (err.isOperation) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    res.status(err.statusCode).json({
        status: err.status,
        message:
            'Something went wrong, please try again or contact us.',
    });
};

const handleJWTError = () => {
    const message =
        "You don't have permission to access this endpoint!";
    return new AppError(message, 401);
};

const handleDuplicate = () => {
    const message = 'Duplicate email';
    return new AppError(message, 400);
};

const handleValidationError = (err) => {
    const message = Object.keys(err.errors)
        .map((key) => err.errors[key].message)
        .join(' - ');
    return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Something went wrong!';
    if (process.env.NODE_ENV === 'development') {
        return resDevEnv(res, err);
    }
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error2 = { ...err };
    error2.message = err.message;
    if (err.name === 'JsonWebTokenError')
        error2 = handleJWTError();
    if (err.code === 11000) error2 = handleDuplicate();
    if (err.name === 'ValidationError')
        error2 = handleValidationError(error2);
    resProdEnv(res, error2);
};
