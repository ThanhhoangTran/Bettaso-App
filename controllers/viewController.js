const Booking = require('../models/bookingModel');
const Post = require('../models/postModel');
const Features = require('../utils/features');
const Comment = require('../models/commentModel');
const Food = require('../models/foodModel');
const catchAsync = require('../utils/catchAsync')
const url = require('url')
exports.getLimit = (Model, limit = 0)=>{
  return async (req,res,next)=>{
    req.data = await Model.find({}).limit(limit);
    next();
  }
}
exports.getOverview = async(req, res, next) => {
  res.status(200).render('overview', {
    title: 'Home Page',
    foods: req.data
  });
};

exports.getStore = (req, res,next)=>{
  res.status(200).render('store', {
    title: 'Store Page',
    foods: req.data
  })
}


exports.getFormLogin = (req, res, next)=>{
  res.status(200).render('login',
  {
    title: 'Login Page'
  })
}
exports.getFormRegister = (req, res, next)=>{
  res.status(200).render('register', {
    title: 'Register Page'
  })
}
exports.alerts = (req, res, next)=>{
  const {payment} = req.query;
  if (payment == 'success') {
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
  }
  next();
}
exports.getContact = (req, res,next)=>{
  res.status(200).render('contact', {
    title: 'Contact Page'
  })
}

exports.getMyCart = async (req, res, next)=>{
  const bookings = await Booking.find({user: req.user._id}).populate('user').populate({
    path: 'foods.food',
    select: 'name'
  });
  res.status(200).render('myCart', {
    title: 'My Cart Page',
    bookings
  })
}
exports.getBlog = async(req, res)=>{
  const features = new Features(Post, req.query)
      .filter()
      .sort()
      .pages()
      .fields();
  const posts = await features.query;
  var total = await Post.find({}).sort({createAt: -1});
  const categorys = Array.from(new Set(total.map(el=>el.category).flat()));
  res.status(200).render('blog',{
    title: 'Blog Page',
    posts: posts.slice(0, 4),
    category: req.query.category || null,
    currentPage: req.query.page || 1,
    postRecent: total,
    categorys,
    total: req.query.category && Math.ceil(posts.length/4) || Math.ceil(total.length / 4)
  })
}

exports.getBlogDetail = catchAsync(async(req, res)=>{
  const {flag} = req.params;
  const post = await Post.findOne({flag});
  var total = await Post.find({}).sort({createAt: -1});
  const categorys = Array.from(new Set(total.map(el=>el.category).flat()));

  res.status(200).render('detail', {
    title: post.title,
    post: post,
    postRecent: total,
    comments: post.comments,
    categorys
  })
});

exports.getCart = (req, res,next)=>{
  res.status(200).render('viewCart', {
    title: 'View Cart'
  })
}
exports.chat = (req, res)=>{
  res.status(200).render('chat', {
    title: 'Chat Page',
  })
}
exports.getMe = (req, res, next)=>{
  res.status(200).render('me', {
    title: 'My Account'
  })
}