const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/updateMe', authController.protect, userController.uploadUserPhoto, userController.updateMe);
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'staff'),
    userController.getAllUser
  )
  .post(userController.createUser);
router
  .route('/:id')
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userController.updateUser
  )
  .get(
    authController.protect,
    authController.restrictTo('admin', 'staff'),
    userController.getUser
  );

module.exports = router;
