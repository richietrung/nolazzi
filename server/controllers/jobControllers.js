/* eslint-disable node/no-unsupported-features/es-syntax */
const factory = require('./factoryControllers');
const JobModel = require('../models/jobModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllJobs = factory.getAll(JobModel);
exports.getJob = factory.getOne(JobModel, {
    path: 'list',
    select: '-__v -user',
});
exports.createJob = factory.createOne(JobModel);
exports.deleteJob = factory.deleteOne(JobModel);
exports.updateJob = factory.updateOne(JobModel);

exports.autoCreateRepeatJob = catchAsync(
    async (req, res, next) => {
        const date = new Date();
        const currentDate = `${date.getFullYear()}-${
            date.getMonth() + 1
        }-${date.getDate()}`;
        const jobs = await JobModel.find({
            remindDate: { $lte: new Date(currentDate) },
            repeat: { $ne: 'never' },
        });
        jobs.forEach(async (job) => {
            const data = job.toObject();
            delete data._id;
            delete data.createdAt;
            const newJob = new JobModel(data);
            do {
                if (newJob.repeat === 'daily') {
                    newJob.remindDate = new Date(
                        newJob.remindDate.getTime() + 86400000
                    );
                }
                if (newJob.repeat === 'weekly') {
                    newJob.remindDate = new Date(
                        newJob.remindDate.getTime() + 604800000
                    );
                }
                if (newJob.repeat === 'monthly') {
                    newJob.remindDate = new Date(
                        newJob.remindDate.getTime() + 2592000000
                    );
                }
            } while (newJob.remindDate <= new Date(currentDate));
            newJob.completed = false;
            await newJob.save();
        });
        next();
    }
);

exports.autoDeleteJobs = catchAsync(async (req, res, next) => {
    const date = new Date();
    const currentDate = `${date.getFullYear()}-${
        date.getMonth() + 1
    }-${date.getDate()}`;
    await JobModel.deleteMany({
        remindDate: {
            $lt: new Date(currentDate),
        },
    });
    next();
});

const completeFn = async (
    job,
    _doc,
    newTime,
    repeatTime,
    res
) => {
    job.completed = true;
    job.list = undefined;
    await job.save();
    newTime = job.remindDate.getTime() + 86400000 * repeatTime;
    _doc.remindDate = new Date(newTime);
    const newJob = await JobModel.create(_doc);
    res.status(200).json({
        status: 'success',
        doc: newJob,
    });
};

exports.completeJob = catchAsync(async (req, res, next) => {
    const job = await JobModel.findById(req.params.id);
    let newTime;
    const _doc = { ...job._doc };
    delete _doc._id;
    delete _doc.createdAt;
    delete _doc.__v;
    delete _doc.remindDate;
    if (!job)
        return next(
            new AppError('No job found with that ID', 404)
        );
    if (job.completed)
        return next(
            new AppError('This job is already completed', 400)
        );
    if (!job.completed && job.repeat === 'never') {
        await JobModel.findByIdAndUpdate(req.params.id, {
            completed: true,
            list: undefined,
        });
        return res.status(204).json({
            status: 'success',
        });
    }
    if (!job.completed && job.repeat === 'daily') {
        return completeFn(job, _doc, newTime, 1, res);
    }
    if (!job.completed && job.repeat === 'weekly') {
        return completeFn(job, _doc, newTime, 7, res);
    }
    if (!job.completed && job.repeat === 'monthly') {
        return completeFn(job, _doc, newTime, 30, res);
    }
    next(new AppError('Something went wrong!', 400));
});
