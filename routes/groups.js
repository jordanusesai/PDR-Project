const express = require('express');
const auth = require('../middleware/auth');
const {
  createGroup,
  getUserGroups,
  getGroupById,
  addMember,
  removeMember,
  updateGroup,
  deleteGroup
} = require('../controllers/groupController');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create group
router.post('/', createGroup);

// Get user's groups
router.get('/', getUserGroups);

// Update group
router.put('/:groupId', updateGroup);

// Delete group
router.delete('/:groupId', deleteGroup);

// Get specific group
router.get('/:groupId', getGroupById);

// Add member to group
router.post('/:groupId/members', addMember);

// Remove member from group
router.delete('/:groupId/members/:userId', removeMember);

module.exports = router;
