const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const router = express.Router();
router.use(authController.protect);
router
  .route('/')
  .get(bookingController.getAllBooking)
  .post(bookingController.createBooking);
router
  .route('/:id')
  .delete(bookingController.deleteBooking)
  .patch(bookingController.updateBooking)
  .get(bookingController.getBooking);

router.post('/checkout',bookingController.createCheckoutSession);
module.exports = router;
