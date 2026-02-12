import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGroup } from '../context/GroupContext';
import { toast } from 'react-toastify';
import { Plus, Users, Calendar, DollarSign } from 'lucide-react';
import api from '../services/api';

const DashboardPage = () => {
  const { groups, fetchGroups, createGroup, loading } = useGroup();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ 
    name: '', 
    description: '', 
    defaultExchangeRate: '1.00' 
  });
  const [recentExpenses, setRecentExpenses] = useState([]);

  useEffect(() => {
    fetchGroups();
    fetchRecentExpenses();
  }, []);

  const fetchRecentExpenses = async () => {
    try {
      const response = await api.get('/expenses/recent');
      setRecentExpenses(response.data.expenses || []);
    } catch (error) {
      console.error('Failed to fetch recent expenses:', error);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    
    if (!newGroup.name.trim()) {
      toast.error('Group name is required');
      return;
    }

    const result = await createGroup(newGroup);
    
    if (result.success) {
      toast.success('Group created successfully!');
      setNewGroup({ name: '', description: '' });
      setShowCreateModal(false);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              color: '#2D3748',
              marginBottom: '0.5rem'
            }}>
              Dashboard
            </h1>
            <p style={{ color: '#718096' }}>
              Manage your groups and track expenses
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Create Group
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
          <div className="card" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <Users size={24} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {groups.length}
                </div>
                <div style={{ opacity: 0.9 }}>Active Groups</div>
              </div>
            </div>
          </div>

          <div className="card" style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            border: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <Calendar size={24} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {recentExpenses.length}
                </div>
                <div style={{ opacity: 0.9 }}>Recent Expenses</div>
              </div>
            </div>
          </div>

          <div className="card" style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            border: 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <DollarSign size={24} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  £{recentExpenses.reduce((sum, exp) => sum + exp.amountGBP, 0).toFixed(2)}
                </div>
                <div style={{ opacity: 0.9 }}>Total Spent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Groups Section */}
        <div className="card">
          <h2 style={{
            fontSize: '1.5rem',
            color: '#2D3748',
            marginBottom: '1.5rem'
          }}>
            Your Groups
          </h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div>Loading groups...</div>
            </div>
          ) : groups.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#718096'
            }}>
              <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3 style={{ marginBottom: '0.5rem' }}>No groups yet</h3>
              <p>Create your first group to start splitting expenses</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
              >
                <Plus size={20} />
                Create Your First Group
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2">
              {groups.map((group) => (
                <Link
                  key={group._id}
                  to={`/group/${group._id}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <div className="card" style={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    border: '2px solid transparent'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#6B8DD6';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '1rem'
                    }}>
                      <div>
                        <h3 style={{
                          fontSize: '1.2rem',
                          color: '#2D3748',
                          marginBottom: '0.5rem'
                        }}>
                          {group.name}
                        </h3>
                        {group.description && (
                          <p style={{
                            color: '#718096',
                            fontSize: '0.9rem',
                            marginBottom: '1rem'
                          }}>
                            {group.description}
                          </p>
                        )}
                      </div>
                      <div style={{
                        backgroundColor: '#6B8DD6',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {group.members.length} members
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#718096',
                      fontSize: '0.9rem'
                    }}>
                      <Users size={16} />
                      <span>
                        Created by {group.createdBy.username}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Create Group Modal */}
        {showCreateModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="card" style={{
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#2D3748',
                marginBottom: '1.5rem'
              }}>
                Create New Group
              </h2>
              
              <form onSubmit={handleCreateGroup}>
                <div className="form-group">
                  <label className="form-label">Group Name *</label>
                  <input
                    type="text"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    className="form-input"
                    placeholder="Enter group name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    className="form-textarea"
                    placeholder="What's this group for?"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Default Exchange Rate (1 GBP = X local currency)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newGroup.defaultExchangeRate}
                    onChange={(e) => setNewGroup({ ...newGroup, defaultExchangeRate: e.target.value })}
                    className="form-input exchange-rate-field"
                    placeholder="1.00"
                  />
                  <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.25rem' }} className="exchange-rate-hint">
                    Set to 0 if expenses will be in GBP, or enter the exchange rate for your local currency
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
