const Food = require('../models/foodModel');
const factory = require('./factoryController');
exports.createFood = factory.createOne(Food);
exports.getFood = factory.getOne(Food);
exports.deleteFood = factory.deleteOne(Food);
exports.getAllFood = factory.getAll(Food);
exports.updateFood = factory.updateOne(Food);
