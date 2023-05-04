const express = require('express');

const authControllers = require('../controllers/authControllers');
const controllers = require('../controllers/userControllers');

const Router = express.Router();

//For user
Router.post('/login', authControllers.login);
Router.post('/signup', authControllers.signup);
Router.post('/refreshToken', authControllers.refreshToken);
Router.post(
    '/reset-password',
    authControllers.protected,
    authControllers.resetPassword
);
Router.post('/forgot-password', authControllers.forgotPassword);
Router.post(
    '/resetPassword/:token',
    authControllers.resetPasswordWithEmail
);
Router.patch(
    '/updateMe',
    authControllers.protected,
    controllers.uploadUserPhoto,
    controllers.updateUserData
);
Router.get(
    '/userinfo',
    authControllers.protected,
    controllers.getUser
);
Router.get(
    '/logout',
    authControllers.protected,
    authControllers.logout
);
//For Admin
// Router.use(authControllers.protected)
Router.route('/')
    .get(controllers.getAllUsers)
    .post(controllers.createUser);

module.exports = Router;
