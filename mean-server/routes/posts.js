const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const PostController = require('../controllers/post');
const fileUpload = require('../middleware/file-upload');

router
  .route('/')
  .get(PostController.getPosts)
  .post(checkAuth, fileUpload, PostController.addPost);

router.put(
  '/:id',
  checkAuth,
  fileUpload,
  PostController.updatePost
);

router.delete('/:id', checkAuth, PostController.deletePost);

router.get('/:id', PostController.getPostDetails);

module.exports = router;
