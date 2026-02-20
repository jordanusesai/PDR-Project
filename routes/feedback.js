const express = require('express');
const auth = require('../middleware/auth');
const {
  submitFeedback,
  getFeedbacks,
  updateFeedbackStatus,
  updateFeedbackNotes
} = require('../controllers/feedbackController');

const router = express.Router();

// Submit feedback (no auth required - allow anonymous feedback)
router.post('/', submitFeedback);

// Get feedbacks (admin only)
router.get('/', auth, getFeedbacks);

// Update feedback status (admin only)
router.put('/:feedbackId/status', auth, updateFeedbackStatus);

// Update feedback notes (admin only)
router.put('/:feedbackId/notes', auth, updateFeedbackNotes);

module.exports = router;
