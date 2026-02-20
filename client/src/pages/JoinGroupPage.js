import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Users, Check, X, AlertCircle, UserPlus } from 'lucide-react';
import api from '../services/api';
import './JoinGroupPage.css';

const JoinGroupPage = () => {
  const { groupId, token } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [groupInfo, setGroupInfo] = useState(null);
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (groupId && token) {
      validateShareLink();
    } else {
      setError('Invalid share link');
      setLoading(false);
    }
  }, [groupId, token]);

  const validateShareLink = async () => {
    setValidating(true);
    try {
      const response = await api.get(`/share/validate/${groupId}/${token}`);
      setGroupInfo(response.data.group);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid or expired share link');
    } finally {
      setValidating(false);
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    setJoining(true);
    try {
      const response = await api.post(`/share/join/${groupId}/${token}`);
      toast.success('Successfully joined the group!');
      navigate(`/group/${groupId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join group');
    } finally {
      setJoining(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', loginData);
      login(response.data.token, response.data.user);
      toast.success('Logged in successfully!');
      setShowLogin(false);
      // Auto-join after login
      setTimeout(() => handleJoinGroup(), 500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  if (loading) {
    return (
      <div className="join-group-loading">
        <div className="spinner"></div>
        <p>Validating share link...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="join-group-error">
        <div className="error-container">
          <AlertCircle size={48} color="#ef4444" />
          <h2>Invalid Link</h2>
          <p>{error}</p>
          <div className="error-actions">
            <Link to="/login" className="btn btn-primary">
              Go to Login
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="join-group-page">
      <div className="container">
        <div className="join-card">
          <div className="join-header">
            <div className="join-icon">
              <Users size={48} />
            </div>
            <h1>Join Expense Group</h1>
            <p>You've been invited to join an expense group</p>
          </div>

          {groupInfo && (
            <div className="group-info-card">
              <h3>{groupInfo.name}</h3>
              <div className="group-stats">
                <div className="stat">
                  <Users size={16} />
                  <span>{groupInfo.members} members</span>
                </div>
              </div>
            </div>
          )}

          {user ? (
            <div className="join-section">
              <div className="user-info">
                <div className="user-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p>Joining as:</p>
                  <strong>{user.username}</strong>
                </div>
              </div>
              
              <button
                onClick={handleJoinGroup}
                disabled={joining}
                className="btn btn-primary join-btn"
              >
                {joining ? (
                  <>
                    <div className="spinner-small"></div>
                    Joining...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Join Group
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="auth-section">
              <div className="auth-options">
                <div className="auth-option">
                  <h3>Already have an account?</h3>
                  <p>Log in to join the group with your existing account</p>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="btn btn-primary"
                  >
                    Log In
                  </button>
                </div>

                <div className="auth-divider">
                  <span>OR</span>
                </div>

                <div className="auth-option">
                  <h3>New to PDR Split?</h3>
                  <p>Create a free account to join the group</p>
                  <Link to="/register" className="btn btn-secondary">
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Login Modal */}
          {showLogin && (
            <div className="login-modal-overlay">
              <div className="login-modal">
                <div className="login-header">
                  <h3>Log In to Join Group</h3>
                  <button
                    onClick={() => setShowLogin(false)}
                    className="close-btn"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleLogin} className="login-form">
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      className="form-input"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className="form-input"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  
                  <button type="submit" className="btn btn-primary">
                    Log In & Join Group
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinGroupPage;
