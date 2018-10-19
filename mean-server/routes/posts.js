const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }

    cb(error, 'images');
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, fileName + '-' + Date.now() + '.' + ext);
  }
});
router
  .route('/')
  .get(async (req, res) => {
    try {
      const posts = await Post.find();
      res.status(200).json({
        message: 'Posts listed successfully',
        posts: posts
      });
    } catch (error) {
      res.status(400).json({
        message: 'Post listing failed',
        error: error
      });
    }
  })
  .post(multer(storage).single('image'), async (req, res) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content
    });
    try {
      const result = await post.save();
      res.status(201).json({
        message: 'Post created successfully',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        message: 'Post creation failed',
        error: error
      });
    }
  });

router.put('/:id', async (req, res) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
  });
  try {
    const result = await Post.updateOne({ _id: req.params.id }, post);
    res.status(200).json({
      message: 'Post updated successfuly',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed',
      data: null
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Post.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: 'Post deleted successfuly',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed',
      data: null
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.status(200).json({
        message: 'Post is  successfully',
        data: post
      });
    } else {
      res.status(404).json({
        message: 'Post is not found',
        data: null
      });
    }
  } catch (error) {
    res.status(400).json({
      message: 'Error occured',
      data: null
    });
  }
});

module.exports = router;
