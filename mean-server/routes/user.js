const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const SECRET_KEY = process.env.SECRET_KEY;

router.post('/signup', async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      email: req.body.email,
      password: hash
    });

    const result = await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      data: { email: result.email, userId: result._id }
    });
  } catch (error) {
    res.status(400).json({
      message: "User creation failed",
      data: null
    });
  }

});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error('Authentication failed');
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      throw new Error('Authentication failed');
    }

    const token = await jwt.sign({email: user.email, userId: user._id}, SECRET_KEY, {expiresIn: '1h'});

    res.status(200).json({
      message: 'User logined successfully',
      data: {
        token: token,
        expiresIn: 3600
      }
    });
  } catch (error) {
    res.status(401).json({
      message: 'User authentication failed',
      data: null
    });
  }

});

module.exports = router;