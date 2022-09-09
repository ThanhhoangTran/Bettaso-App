const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const { promisify } = require('util');
const User = require('../models/userModel');
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRES_TOKEN,
  });
};
const createSentToken = (user, req, res, statusCode) => {
  const token = signToken(user._id);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-photo'] === 'https',
  });
  //remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      data: user
    },
  });
};
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  //2) check if user exist && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  //3)if everything ok, send token to client
  createSentToken(user, req, res, 200);
});

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const url = `${req.protocol}://${req.get('host')}`
  await sendMail({template: 'welcome', user: newUser, subject: 'Welcome you. Start your receipe with Bettaso here!', url})
  createSentToken(newUser, req, res, 200);
});


exports.protect = catchAsync(async (req, res, next) => {
  //1)Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  //2)Verification token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_TOKEN
  );
  //3)Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  //4)Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password ! Please log in again.', 401)
    );
  }
  //5)Grant access
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});


exports.isLoggedIn = async (req, res, next) => {
  //1)Getting token and check of it's there
  try {
    if (req.cookies.jwt) {
      //1)Verification token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET_TOKEN
      );
      //2)Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      //3)Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    }
  } catch (err) {
    return next();
  }
  next();
};
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
    message: 'logout successfull',
  });
};
