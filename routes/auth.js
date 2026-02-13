// updateProfile to your imports
const { register, login, updateProfile } = require('../controllers/authController');
const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      avatar: req.user.avatar,
      needsUsername: !req.user.username // Tells frontend to show setup screen
    }
  });
});

// Update profile route
router.put('/update-profile', auth, updateProfile);

module.exports = router;