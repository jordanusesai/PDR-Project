const express = require('express');
const auth = require('../middleware/auth');
const {
  createGroup,
  getUserGroups,
  getGroupById,
  addMember,
  removeMember
} = require('../controllers/groupController');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create group
router.post('/', createGroup);

// Get user's groups
router.get('/', getUserGroups);

// Get specific group
router.get('/:groupId', getGroupById);

// Add member to group
router.post('/:groupId/members', addMember);

// Remove member from group
router.delete('/:groupId/members/:userId', removeMember);

module.exports = router;
