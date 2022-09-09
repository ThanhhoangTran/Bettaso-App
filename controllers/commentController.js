const Comment = require('../models/commentModel');
const factory = require('./factoryController');
const catchAsync = require('../utils/catchAsync')
// api/posts/idPost/comments
exports.setComment = (req, res, next)=>{
    if(!req.body.post) req.body.post = req.params.postId;
    if(!req.body.user) req.body.user = req.user._id;
    next();
}
exports.createComment = catchAsync(async(req, res, next)=>{
    const parent = await Comment.findById(req.body.to);
    if(parent){
        parent.replies.push(new Comment(req.body));
        await parent.save();
    }
    else  {
        await Comment.create(req.body);
    }
    res.status(201).json({
        status: 'success'
    })
})
exports.getComment = factory.getOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
exports.getAllComment = factory.getAll(Comment);
exports.updateComment = factory.updateOne(Comment);
