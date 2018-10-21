const postRoutes = require('./posts');
const userRoutes = require('./user');

module.exports = (app) => {
  app.use('/posts', postRoutes);
  app.use('/user', userRoutes);
}