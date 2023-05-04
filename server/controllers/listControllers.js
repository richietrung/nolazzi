const factory = require('./factoryControllers');
const ListModel = require('../models/listModel');

exports.getAllLists = factory.getAll(ListModel);
exports.getList = factory.getOne(ListModel, {
    path: 'user',
    select: 'email accountName',
});
exports.createList = factory.createOne(ListModel);
exports.updateList = factory.updateOne(ListModel);
exports.deleteList = factory.deleteOne(ListModel);
