const postRoutes = require('./posts');

module.exports = (app) => {
  app.use('/posts', postRoutes);
}