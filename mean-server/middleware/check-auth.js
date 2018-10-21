
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.autharization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (error) {
    res.status(401).json({
      message: "Authentication failed",
      data: null
    });
  }
}