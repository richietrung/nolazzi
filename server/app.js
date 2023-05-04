/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
// const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const errHandler = require('./controllers/errController');
const userRouter = require('./routes/userRoutes');
const jobRouter = require('./routes/jobRoutes');
const listRouter = require('./routes/listRoutes');

const app = express();

//SET STATIC FILE
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'assets')));

//GLOBAL MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(
    cors({
        origin: process.env.REACT_URL,
        credentials: true,
    })
);
app.options('*', cors());
app.use(helmet());
// app.use(
//     '/api',
//     rateLimit({
//         max: 10,
//         windowMs: 60 * 60 * 1000,
//         message:
//             'Too many requests per hour, please try again later!!!',
//         skipFailedRequests: false,
//     })
// );
app.use(
    hpp({
        whitelist: [
            'priority',
            'name',
            'list',
            'user',
            'createdAt',
            'remindTime',
            'RemindDate',
            'repeat',
            'endRepeat',
        ],
    })
);

//Body-parser
app.use(
    bodyParser.urlencoded({ limit: '10kb', extended: false })
);
app.use(bodyParser.json({ limit: '10kb' }));
app.use(cookieParser({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xssClean());

//ROUTES
app.get('/', (req, res, next) => {
    res.status(200).json({
        status: 'SERVER ON',
    });
});
app.use('/api/nolazzi/users', userRouter);
app.use('/api/nolazzi/jobs', jobRouter);
app.use('/api/nolazzi/lists', listRouter);

app.all('*', (req, res, next) => {
    next(
        new AppError(
            `Failed to access this route: ${req.originalUrl}`,
            404
        )
    );
});

app.use(errHandler);

module.exports = app;
