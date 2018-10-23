const Post = require('../models/Post');

const getPosts = async (req, res) => {
    try {
      let page = req.query.page ? +req.query.page : 1; // for no query params
      let size = req.query.size ? +req.query.size : 2; // for no query params
      page = page ? page : 1; // to avoid zero condition
      size = size ? size : 2; // to avoid zero condition

      const postQuery = Post.find()
        .skip((page - 1) * size)
        .limit(size);
      const posts = await postQuery;
      const postsCount = await Post.countDocuments();
      res.status(200).json({
        message: 'Posts listed successfully',
        data: {
          posts,
          postsCount
        }
      });
    } catch (error) {
      res.status(400).json({
        message: 'Post listing failed',
        error: error
      });
    }
  };

  const addPost = async (req, res) => {
    const url = `${req.protocol}://${req.get('host')}`;
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: `${url}/images/${req.file.filename}`,
      creator: req.user.id
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
  };

const updatePost = 
  async (req, res) => {
    let imagePath = req.body.imagePath;

    if (req.file) {
      const url = `${req.protocol}://${req.get('host')}`;
      imagePath = `${url}/images/${req.file.filename}`;
    }
    const post = new Post({
      _id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.user.id
    });

    try {
      const result = await Post.updateOne({ _id: req.params.id, creator: req.user.id }, post);
      if (result.n > 0) {
        res.status(200).json({
          message: 'Post updated successfuly',
          data: result
        });
      } else {
        res.status(401).json({
          message: 'Un Authorized',
          data: null
        });
      }

    } catch (error) {
      res.status(400).json({
        message: 'Failed',
        data: null
      });
    }
  }

const deletePost = async (req, res) => {
  try {
    const result = await Post.deleteOne({ _id: req.params.id, creator: req.user.id });
    if (result.n > 0) {
      res.status(200).json({
        message: 'Post deleted successfuly',
        data: result
      });
    } else {
      res.status(401).json({
        message: 'Un Authorized',
        data: null
      });
    }
  } catch (error) {
    res.status(400).json({
      message: 'Failed',
      data: null
    });
  }
}

const getPostDetails = async (req, res) => {
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
}

module.exports = {
  getPosts,
  getPostDetails,
  deletePost,
  updatePost,
  addPost
};
