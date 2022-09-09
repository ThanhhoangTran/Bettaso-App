const Post = require('../models/postModel');
const factory = require('./factoryController');
exports.createPost = factory.createOne(Post);
exports.getPost = factory.getOne(Post);
exports.deletePost = factory.deleteOne(Post);
exports.getAllPost = factory.getAll(Post);
exports.updatePost = factory.updateOne(Post);
