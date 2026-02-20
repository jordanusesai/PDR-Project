const Feedback = require('../models/Feedback');
const User = require('../models/User');

const submitFeedback = async (req, res) => {
  try {
    const {
      type,
      rating,
      subject,
      message,
      email,
      triggerLocation,
      userAgent,
      timestamp,
      url
    } = req.body;

    // Validation
    if (!type || !subject || !message) {
      return res.status(400).json({ message: 'Type, subject, and message are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const feedback = new Feedback({
      type,
      rating,
      subject,
      message,
      email: email || null,
      triggerLocation,
      userAgent,
      timestamp,
      url,
      ipAddress: req.ip,
      userId: req.user?._id || null
    });

    await feedback.save();

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getFeedbacks = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { page = 1, limit = 20, type } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (type) {
      query.type = type;
    }

    const feedbacks = await Feedback.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username email');

    const total = await Feedback.countDocuments(query);

    res.json({
      feedbacks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get feedbacks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateFeedbackStatus = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { feedbackId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    feedback.status = status;
    await feedback.save();

    res.json({
      message: 'Status updated successfully',
      feedback
    });
  } catch (error) {
    console.error('Update feedback status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateFeedbackNotes = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { feedbackId } = req.params;
    const { adminNotes } = req.body;

    if (!adminNotes) {
      return res.status(400).json({ message: 'Notes are required' });
    }

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    feedback.adminNotes = adminNotes;
    await feedback.save();

    res.json({
      message: 'Notes updated successfully',
      feedback
    });
  } catch (error) {
    console.error('Update feedback notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  submitFeedback,
  getFeedbacks,
  updateFeedbackStatus,
  updateFeedbackNotes
};
