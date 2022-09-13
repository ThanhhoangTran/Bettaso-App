const express = require('express');
const Food = require('../models/foodModel')
const viewController = require('../controllers/viewController');
const authController =  require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

router.use(viewController.alerts);
router.get('/', authController.isLoggedIn, bookingController.isCheckoutSuccess, viewController.getLimit(Food, 6), viewController.getOverview);
router.get('/blog/:flag', authController.isLoggedIn, viewController.getBlogDetail)
router.get('/store', authController.isLoggedIn, viewController.getLimit(Food), viewController.getStore);
router.get('/contact',authController.isLoggedIn, viewController.getContact);
router.get('/login', viewController.getFormLogin);
router.get('/register', viewController.getFormRegister);
router.get('/blogs', authController.isLoggedIn, viewController.getBlog);
router.get('/cart', authController.isLoggedIn, viewController.getCart)
router.get('/chat', authController.isLoggedIn, viewController.chat)
router.get('/me', authController.protect, authController.isLoggedIn, viewController.getMe);
module.exports = router;
