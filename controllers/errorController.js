const AppError = require('../utils/appError');
const extend = require('util')._extend;
const handleCastErrorDB = (err) => {
  let message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  let value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  let message = `Duplicate field value: ${value}.Please use another value!`;
  return new AppError(message, 800);
};
const handleValidationError = (err) => {
  let value = Object.values(err.errors).map((el) => el.message);
  let message = `Validation error: ${value.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = (err) =>
  new AppError('Invalid Token. Please log in again !', 401);
const handleExpiredJWTError = (err) =>
  new AppError('Your token has expired. Please log in again !', 401);
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    console.error('Error', err);
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    //RENDERED WEBSITE
    console.error('Error', err);
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};
const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    //Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      //Programing or unknow error: Don't leak error detail to client
    } else {
      //1) Log error
      console.error('Error', err);

      //2)Send generic message
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong',
      });
    }
  } else {
    console.error('Error', err);
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: 'Please try again later.',
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';
  // console.log(err.stack);
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name == 'CastError') {
      error = handleCastErrorDB(err);
    }
    if (err.code == 11000) {
      error = handleDuplicateFieldsDB(err);
    }
    if (err.name == 'ValidationError') {
      error = handleValidationError(err);
    }
    if (err.name == 'JsonWebTokenError') {
      error = handleJWTError(err);
    }
    if (err.name == 'TokenExpiredError') {
      error = handleExpiredJWTError(err);
    }

    if (!error.message) {
      error.message = err.message;
    }
    sendErrorProd(error, req, res);
  }
};
