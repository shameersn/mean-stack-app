const mongoose = require('mongoose');

const postModel = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    require: true
  }
});

module.exports = mongoose.model('Post', postModel);
