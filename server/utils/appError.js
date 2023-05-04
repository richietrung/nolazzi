class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4')
            ? 'fail'
            : 'error';
        this.isOperation = true;
        Error.captureStackTrace(this, AppError);
    }
}

module.exports = AppError;
