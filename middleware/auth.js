const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Use the same JWT_SECRET fallback as authController
const JWT_SECRET = process.env.JWT_SECRET || '6f9a2b8c3e4d5f1g2h3i4j6k9l7L8a9d0i';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
