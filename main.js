const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRouter');
const commentRouter = require('./routes/commentRouter');
const bookingRouter = require('./routes/bookingRouter');
const foodRouter = require('./routes/foodRouter');
const postRouter = require('./routes/postRouter');
const viewRouter = require('./routes/viewRouter');
const couponRouter = require('./routes/couponRouter')
const cors = require('cors')
const bookingController = require('./controllers/bookingController');
const AppError = require('./utils/appError');
const path = require('path');
const globalErrorHandler = require('./controllers/errorController');
const app = express();
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);
app.use(morgan('dev'));
app.enable('trust proxy');
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser(process.env.SECRET_COOKIE));

app.use('/', viewRouter);
app.use('/api/users', userRouter);
app.use('/api/comments', commentRouter);
app.use('/api/posts', postRouter);
app.use('/api/foods', foodRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/coupons', couponRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on server`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
