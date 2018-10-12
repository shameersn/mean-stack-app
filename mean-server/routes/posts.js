const express = require('express');
const router = express.Router();

router.route('/').get((req, res) => {
  const posts = [
    {
      id: '13434',
      title: 'First post',
      content: 'Test content'
    },
    {
      id: '134dff34',
      title: 'Second post',
      content: 'Test content'
    }
  ]
  res.status(200).json({
    message: 'Posts listed successfully',
    posts: posts
  });
});

module.exports = router;
