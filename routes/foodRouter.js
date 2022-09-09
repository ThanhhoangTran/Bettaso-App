const express = require('express');
const foodController = require('../controllers/foodController');
const authController = require('../controllers/authController');
const router = express.Router();
router
  .route('/')
  .get(foodController.getAllFood)
  .post(authController.protect, authController.restrictTo('admin', 'staff'), foodController.createFood);
router
  .route('/:id')
  .delete(authController.protect, authController.restrictTo('admin', 'staff'),foodController.deleteFood)
  .patch(authController.protect, authController.restrictTo('admin', 'staff'), foodController.updateFood)
  .get(foodController.getFood);

module.exports = router;
