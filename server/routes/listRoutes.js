const express = require('express');

const authControllers = require('../controllers/authControllers');
const controllers = require('../controllers/listControllers');

const Router = express.Router();

Router.use(authControllers.protected);

Router.route('/')
    .get(controllers.getAllLists)
    .post(controllers.createList);

Router.route('/:id')
    .get(controllers.getList)
    .patch(controllers.updateList)
    .delete(controllers.deleteList);

module.exports = Router;
