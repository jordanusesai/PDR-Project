import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MessageSquare, Star, Calendar, User, Mail, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import './AdminFeedbackPage.css';

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: ''
  });
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const feedbackTypes = [
    { value: '', label: 'All Types' },
    { value: 'general', label: 'General Feedback' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'improvement', label: 'Improvement' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'compliment', label: 'Compliment' }
  ];

  const statusTypes = [
    { value: '', label: 'All Status' },
    { value: 'new', label: 'New' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  useEffect(() => {
    fetchFeedbacks();
  }, [pagination.page, filters]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      
      // Remove empty filter values
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });

      const response = await api.get('/feedback', { params });
      setFeedbacks(response.data.feedbacks);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch feedback');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleStatusUpdate = async (feedbackId, newStatus) => {
    try {
      await api.put(`/feedback/${feedbackId}/status`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchFeedbacks();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleNoteUpdate = async (feedbackId, adminNotes) => {
    try {
      await api.put(`/feedback/${feedbackId}/notes`, { adminNotes });
      toast.success('Notes updated successfully');
      fetchFeedbacks();
    } catch (error) {
      toast.error('Failed to update notes');
    }
  };

  const openFeedbackDetail = (feedback) => {
    setSelectedFeedback(feedback);
    setShowDetailModal(true);
  };

  const closeFeedbackDetail = () => {
    setShowDetailModal(false);
    setSelectedFeedback(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return '#ef4444';
      case 'reviewed': return '#f59e0b';
      case 'resolved': return '#10b981';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'bug': return '#ef4444';
      case 'feature': return '#3b82f6';
      case 'improvement': return '#8b5cf6';
      case 'complaint': return '#ef4444';
      case 'compliment': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (loading && pagination.page === 1) {
    return (
      <div className="admin-feedback-loading">
        <div className="spinner"></div>
        <p>Loading feedback data...</p>
      </div>
    );
  }

  return (
    <div className="admin-feedback-page">
      <div className="container">
        <div className="admin-feedback-header">
          <h1>Feedback Management</h1>
          <p>View and manage user feedback from across the application</p>
        </div>

        {/* Filters */}
        <div className="feedback-filters">
          <div className="filter-group">
            <div className="filter-item">
              <label>Type:</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="form-select"
              >
                {feedbackTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label>Status:</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="form-select"
              >
                {statusTypes.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label>Search:</label>
              <div className="search-input">
                <Search size={16} />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search subject or message..."
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="feedback-list">
          {feedbacks.length === 0 ? (
            <div className="no-feedback">
              <MessageSquare size={48} />
              <h3>No feedback found</h3>
              <p>No feedback matches your current filters.</p>
            </div>
          ) : (
            feedbacks.map(feedback => (
              <div key={feedback._id} className="feedback-item" onClick={() => openFeedbackDetail(feedback)}>
                <div className="feedback-header">
                  <div className="feedback-meta">
                    <span 
                      className="feedback-type" 
                      style={{ backgroundColor: getTypeColor(feedback.type) }}
                    >
                      {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
                    </span>
                    <span 
                      className="feedback-status"
                      style={{ backgroundColor: getStatusColor(feedback.status) }}
                    >
                      {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                    </span>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < feedback.rating ? '#FFD700' : 'none'}
                          color={i < feedback.rating ? '#FFD700' : '#d1d5db'}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="feedback-date">
                    <Calendar size={14} />
                    {new Date(feedback.timestamp).toLocaleDateString()}
                  </div>
                </div>

                <div className="feedback-content">
                  <h4>{feedback.subject}</h4>
                  <p>{feedback.message.substring(0, 150)}{feedback.message.length > 150 ? '...' : ''}</p>
                </div>

                <div className="feedback-footer">
                  <div className="feedback-location">
                    <span>From: {feedback.triggerLocation.replace('-', ' ')}</span>
                  </div>
                  <div className="feedback-user">
                    {feedback.userId ? (
                      <>
                        <User size={14} />
                        <span>{feedback.userId.username}</span>
                      </>
                    ) : (
                      <span>Anonymous</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="btn btn-secondary"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            
            <span className="page-info">
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </span>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="btn btn-secondary"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          onClose={closeFeedbackDetail}
          onStatusUpdate={handleStatusUpdate}
          onNoteUpdate={handleNoteUpdate}
        />
      )}
    </div>
  );
};

const FeedbackDetailModal = ({ feedback, onClose, onStatusUpdate, onNoteUpdate }) => {
  const [status, setStatus] = useState(feedback.status);
  const [adminNotes, setAdminNotes] = useState(feedback.adminNotes || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await Promise.all([
        onStatusUpdate(feedback._id, status),
        onNoteUpdate(feedback._id, adminNotes)
      ]);
      onClose();
    } catch (error) {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-detail-overlay">
      <div className="feedback-detail-modal">
        <div className="detail-header">
          <h3>Feedback Details</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="detail-content">
          <div className="detail-section">
            <h4>Subject</h4>
            <p>{feedback.subject}</p>
          </div>

          <div className="detail-section">
            <h4>Message</h4>
            <p>{feedback.message}</p>
          </div>

          <div className="detail-meta">
            <div className="meta-item">
              <label>Type:</label>
              <span>{feedback.type}</span>
            </div>
            <div className="meta-item">
              <label>Rating:</label>
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < feedback.rating ? '#FFD700' : 'none'}
                    color={i < feedback.rating ? '#FFD700' : '#d1d5db'}
                  />
                ))}
              </div>
            </div>
            <div className="meta-item">
              <label>Location:</label>
              <span>{feedback.triggerLocation}</span>
            </div>
            <div className="meta-item">
              <label>Date:</label>
              <span>{new Date(feedback.timestamp).toLocaleString()}</span>
            </div>
            {feedback.email && (
              <div className="meta-item">
                <label>Email:</label>
                <span>{feedback.email}</span>
              </div>
            )}
          </div>

          <div className="detail-actions">
            <div className="form-group">
              <label>Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-select"
              >
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Admin Notes:</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="form-textarea"
                rows={4}
                placeholder="Add internal notes about this feedback..."
              />
            </div>
          </div>
        </div>

        <div className="detail-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} disabled={loading} className="btn btn-primary">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminFeedbackPage;
