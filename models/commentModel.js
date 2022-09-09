
const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  replies: [this],
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
commentSchema.pre('find', function(next){
  this.populate('user');
  next();
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
