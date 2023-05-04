const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        const features = new APIFeatures(Model.find(), req.query)
            .filter()
            .sort()
            .fields()
            .limit();
        const docs = await features.query;
        res.status(200).json({
            status: 'success',
            results: docs.length,
            data: {
                docs,
            },
        });
    });

exports.getOne = (Model, population) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findById(req.params.id)
            .populate(population)
            .select('-password');
        if (!doc)
            return next(
                new AppError(
                    'No document found with that ID',
                    404
                )
            );
        res.status(200).json({ statusbar: 'success', doc });
    });

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);
        res.status(200).json({
            status: 'success',
            doc,
        });
    });

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        await Model.findByIdAndRemove(req.params.id);
        res.status(204).json({ statusbar: 'success' });
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { runValidators: true, new: true }
        );
        res.status(200).json({
            status: 'success',
            data: {
                doc,
            },
        });
    });
