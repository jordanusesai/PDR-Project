const express = require('express');
const auth = require('../middleware/auth');
const {
  sendGroupInvitation,
  validateShareToken,
  joinViaShareLink
} = require('../controllers/shareController');

const router = express.Router();

// Send group invitation (requires authentication)
router.post('/invite', auth, sendGroupInvitation);

// Validate share token (no auth required)
router.get('/validate/:groupId/:token', validateShareToken);

// Join group via share link (requires authentication)
router.post('/join/:groupId/:token', auth, joinViaShareLink);

module.exports = router;
