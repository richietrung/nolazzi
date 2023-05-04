const express = require('express');

const authControllers = require('../controllers/authControllers');
const controllers = require('../controllers/jobControllers');

const Router = express.Router();

Router.use(authControllers.protected);

Router.route('/')
    .get(
        controllers.autoCreateRepeatJob,
        controllers.autoDeleteJobs,
        controllers.getAllJobs
    )
    .post(controllers.createJob);

Router.route('/:id')
    .get(controllers.getJob)
    .patch(controllers.updateJob)
    .delete(controllers.deleteJob);

Router.route('/complete/:id').patch(controllers.completeJob);

module.exports = Router;
