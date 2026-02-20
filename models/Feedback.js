const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['general', 'bug', 'feature', 'improvement', 'complaint', 'compliment']
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  triggerLocation: {
    type: String,
    required: true,
    enum: ['dashboard', 'group-page', 'add-expense', 'edit-expense']
  },
  userAgent: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'resolved', 'closed'],
    default: 'new'
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for better query performance
feedbackSchema.index({ type: 1, timestamp: -1 });
feedbackSchema.index({ status: 1, timestamp: -1 });
feedbackSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
