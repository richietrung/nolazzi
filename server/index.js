const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION!');
    console.log(err.name, ':', err.message);
    process.exit(1);
});
const app = require('./app');

const uri = process.env.DB_URI.replace(
    '<PASSWORD>',
    process.env.DB_PASSWORD
);

const port = process.env.PORT || 3000;

mongoose.set('strictQuery', false).connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const server = app.listen(port, () => {
    console.log(
        `${process.env.NODE_ENV}\nListening request on port: ${process.env.PORT}`
    );
});

// Global error handler for unhandled promise rejections
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    server.close(() => {
        console.log('Http server closed.');
        mongoose.connection.close(false, () => {
            console.log('MongoDb connection closed.');
            process.exit(0);
        });
    });
});
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION!');
    console.log(`${err.name} => ${err.message}`);
    console.log(err.stack);
    server.close(() => process.exit(1));
});
