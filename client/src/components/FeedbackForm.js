import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { MessageSquare, X, Send, Star } from 'lucide-react';
import api from '../services/api';
import './FeedbackForm.css';

const FeedbackForm = ({ isOpen, onClose, triggerLocation }) => {
  const [formData, setFormData] = useState({
    type: 'general',
    rating: 5,
    subject: '',
    message: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'improvement', label: 'Improvement Suggestion' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'compliment', label: 'Compliment' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const feedbackData = {
        ...formData,
        triggerLocation,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };

      await api.post('/feedback', feedbackData);
      toast.success('Thank you for your feedback! We appreciate your input.');
      
      // Reset form
      setFormData({
        type: 'general',
        rating: 5,
        subject: '',
        message: '',
        email: ''
      });
      
      onClose();
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-overlay">
      <div className="feedback-modal">
        <div className="feedback-header">
          <div className="feedback-title">
            <MessageSquare size={20} />
            <h3>Send Feedback</h3>
          </div>
          <button 
            onClick={onClose} 
            className="feedback-close-btn"
            aria-label="Close feedback form"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label className="form-label">Feedback Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select"
              required
            >
              {feedbackTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Overall Rating</label>
            <div className="rating-container">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`rating-star ${star <= formData.rating ? 'active' : ''}`}
                  aria-label={`Rate ${star} stars`}
                >
                  <Star size={20} fill={star <= formData.rating ? '#FFD700' : 'none'} />
                </button>
              ))}
              <span className="rating-text">({formData.rating}/5)</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Subject *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="form-input"
              placeholder="Brief summary of your feedback"
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Please provide detailed feedback..."
              rows={5}
              maxLength={1000}
              required
            />
            <div className="char-count">
              {formData.message.length}/1000
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email (optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="your.email@example.com"
            />
            <small className="form-hint">
              Only if you'd like us to follow up with you
            </small>
          </div>

          <div className="feedback-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
