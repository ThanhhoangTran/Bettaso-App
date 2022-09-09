const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentRouter = require('./commentRouter');
router.use('/:postId/comments', commentRouter);
router
  .route('/')
  .get(postController.getAllPost)
  .post(postController.createPost);
router
  .route('/:id')
  .delete(postController.deletePost)
  .patch(postController.updatePost)
  .get(postController.getPost);

module.exports = router;
