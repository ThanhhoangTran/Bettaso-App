const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
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
  images: [String],
  imageCover: String,
  category: [String],
  flag: String,
},{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});
postSchema.pre('save', function(next){
  this.flag = this.title.trim().toLowerCase().split(' ').join('-')
  next(); 
});
postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
})
postSchema.index({flag: 1});
postSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'comments',
    populate: { path:  'replies.user',
		          model: 'User' }
  });
  next();
});
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
