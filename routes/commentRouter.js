const express = require('express');
const commentController = require('../controllers/commentController');
const authController= require('../controllers/authController');
const router = express.Router({mergeParams: true});
router
  .route('/')
  .get(commentController.getAllComment)
  .post(authController.protect, commentController.setComment ,commentController.createComment);
router
  .route('/:id')
  .delete(commentController.deleteComment)
  .patch(commentController.updateComment)
  .get(commentController.getComment);

module.exports = router;
