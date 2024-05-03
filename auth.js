const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('./models');

const router = express.Router();

// POST /login endpoint for user authentication
router.post('/login', async (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // If authentication succeeds, generate JWT token
    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  })(req, res, next);
});

module.exports = router;
