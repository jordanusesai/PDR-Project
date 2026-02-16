import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Lock, Mail, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username,
        email: user.email
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      toast.error('Username is required');
      return;
    }
    
    if (formData.username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.put('/auth/profile', {
        username: formData.username.trim(),
        email: formData.email.trim()
      });
      
      updateUser(response.data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!formData.currentPassword) {
      toast.error('Current password is required');
      return;
    }
    
    if (!formData.newPassword) {
      toast.error('New password is required');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      await api.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      toast.success('Password changed successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isDarkMode ? '#E2E8F0' : '#4A5568'
                }}
              >
                <ArrowLeft size={24} />
              </button>
              <h1 style={{
                fontSize: '2rem',
                color: isDarkMode ? '#E2E8F0' : '#2D3748'
              }}>
                Profile Settings
              </h1>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            marginBottom: '2rem',
            borderBottom: `1px solid ${isDarkMode ? '#4A5568' : '#E2E8F0'}`
          }}>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                padding: '1rem 2rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'profile' ? '2px solid #6B8DD6' : 'none',
                color: activeTab === 'profile' ? '#6B8DD6' : (isDarkMode ? '#A0AEC0' : '#718096'),
                cursor: 'pointer',
                fontWeight: activeTab === 'profile' ? '600' : '400'
              }}
            >
              <User size={20} style={{ marginRight: '0.5rem' }} />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('password')}
              style={{
                padding: '1rem 2rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'password' ? '2px solid #6B8DD6' : 'none',
                color: activeTab === 'password' ? '#6B8DD6' : (isDarkMode ? '#A0AEC0' : '#718096'),
                cursor: 'pointer',
                fontWeight: activeTab === 'password' ? '600' : '400'
              }}
            >
              <Lock size={20} style={{ marginRight: '0.5rem' }} />
              Password
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="card">
              <h2 style={{
                marginBottom: '1.5rem',
                color: isDarkMode ? '#E2E8F0' : '#2D3748'
              }}>
                Profile Information
              </h2>
              
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ marginTop: '1rem' }}
              >
                <Save size={20} style={{ marginRight: '0.5rem' }} />
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="card">
              <h2 style={{
                marginBottom: '1.5rem',
                color: isDarkMode ? '#E2E8F0' : '#2D3748'
              }}>
                Change Password
              </h2>
              
              <div className="form-group">
                <label className="form-label">Current Password *</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password *</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ marginTop: '1rem' }}
              >
                <Lock size={20} style={{ marginRight: '0.5rem' }} />
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
