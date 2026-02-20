import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Share2, Mail, X, Copy, Users, Link as LinkIcon, Send } from 'lucide-react';
import api from '../services/api';
import './ShareGroupModal.css';

const ShareGroupModal = ({ isOpen, onClose, group }) => {
  const [emails, setEmails] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [showLinkSection, setShowLinkSection] = useState(false);

  const handleSendInvites = async (e) => {
    e.preventDefault();
    
    if (!emails.trim()) {
      toast.error('Please enter at least one email address');
      return;
    }

    // Parse emails (comma or newline separated)
    const emailList = emails.split(/[\n,]+/)
      .map(email => email.trim())
      .filter(email => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

    if (emailList.length === 0) {
      toast.error('Please enter valid email addresses');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/share/invite', {
        groupId: group._id,
        emails: emailList,
        message: message.trim()
      });

      toast.success(`Invitations sent to ${emailList.length} email${emailList.length > 1 ? 's' : ''}!`);
      setShareLink(response.data.shareLink);
      setShowLinkSection(true);
      
      // Reset form
      setEmails('');
      setMessage('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send invitations');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const generateDirectLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/group/${group._id}`;
  };

  if (!isOpen || !group) return null;

  return (
    <div className="share-modal-overlay">
      <div className="share-modal">
        <div className="share-header">
          <div className="share-title">
            <Share2 size={20} />
            <h3>Share "{group.name}"</h3>
          </div>
          <button 
            onClick={onClose} 
            className="share-close-btn"
            aria-label="Close share modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="share-content">
          {/* Group Info */}
          <div className="group-info">
            <div className="group-details">
              <h4>{group.name}</h4>
              <p>{group.description || 'No description available'}</p>
              <div className="group-stats">
                <div className="stat">
                  <Users size={16} />
                  <span>{group.members?.length || 0} members</span>
                </div>
              </div>
            </div>
          </div>

          {/* Email Invitation Form */}
          <div className="invitation-section">
            <h4>
              <Mail size={16} />
              Invite by Email
            </h4>
            
            <form onSubmit={handleSendInvites} className="invitation-form">
              <div className="form-group">
                <label className="form-label">Email Addresses *</label>
                <textarea
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  className="form-textarea"
                  placeholder="Enter email addresses separated by commas or new lines&#10;example@email.com&#10;friend@email.com, another@email.com"
                  rows={4}
                  required
                />
                <small className="form-hint">
                  Separate multiple emails with commas or new lines
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Personal Message (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-textarea"
                  placeholder="Add a personal message to your invitation..."
                  rows={3}
                  maxLength={500}
                />
                <div className="char-count">
                  {message.length}/500
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !emails.trim()}
              >
                {loading ? (
                  <>
                    <div className="spinner-small"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Invitations
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Direct Link Section */}
          <div className="link-section">
            <h4>
              <LinkIcon size={16} />
              Direct Link
            </h4>
            
            <div className="link-container">
              <div className="link-input-group">
                <input
                  type="text"
                  value={shareLink || generateDirectLink()}
                  readOnly
                  className="link-input"
                />
                <button
                  onClick={() => copyToClipboard(shareLink || generateDirectLink())}
                  className="btn btn-secondary copy-btn"
                  title="Copy link"
                >
                  <Copy size={16} />
                </button>
              </div>
              
              <p className="link-description">
                Share this link directly with others. They'll need to sign up or log in to join the group.
              </p>
            </div>
          </div>

          {/* Success Message */}
          {showLinkSection && (
            <div className="success-message">
              <div className="success-content">
                <h5>Invitations Sent Successfully!</h5>
                <p>Your invitations have been sent. Recipients will receive an email with a link to join the group.</p>
                <div className="success-actions">
                  <button
                    onClick={() => copyToClipboard(shareLink)}
                    className="btn btn-secondary"
                  >
                    <Copy size={16} />
                    Copy Share Link
                  </button>
                  <button
                    onClick={() => setShowLinkSection(false)}
                    className="btn btn-primary"
                  >
                    Send More Invitations
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareGroupModal;
