const express = require('express');
const couponController = require('../controllers/couponController');
const authController = require('../controllers/authController');
const Router = express.Router();
Router.route('/').post(authController.protect, authController.restrictTo("admin"),couponController.createCoupon).get(couponController.getAllCoupon);
Router.route('/:id').patch(authController.protect, authController.restrictTo("admin"),couponController.updateCoupon).delete(authController.protect, authController.restrictTo("admin"),couponController.deleteCoupon).get(couponController.getCoupon);
Router.get('/applyCoupon/:code', couponController.applyCoupon)
module.exports = Router;