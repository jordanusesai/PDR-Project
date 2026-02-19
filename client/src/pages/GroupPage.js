import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGroup } from '../context/GroupContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Plus, Users, ArrowLeft, DollarSign, Edit, Trash2, UserPlus, UserMinus } from 'lucide-react';
import api from '../services/api';

const GroupPage = () => {
  const { groupId } = useParams();
  const { currentGroup, fetchGroup, addMember, removeMember } = useGroup();
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      
      // Fetch group details
      await fetchGroup(groupId);
      
      // Fetch expenses
      const expensesResponse = await api.get(`/expenses/group/${groupId}`);
      setExpenses(expensesResponse.data.expenses);
      
      // Fetch balances
      const balancesResponse = await api.get(`/expenses/group/${groupId}/balances`);
      setBalances(balancesResponse.data.balances);
      
    } catch (error) {
      console.error('Failed to fetch group data:', error);
      toast.error('Failed to load group data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    
    if (!newMemberEmail.trim()) {
      toast.error('Email is required');
      return;
    }

    const result = await addMember(groupId, newMemberEmail);
    
    if (result.success) {
      toast.success('Member added successfully!');
      setNewMemberEmail('');
      setShowAddMember(false);
      fetchGroupData();
    } else {
      toast.error(result.error);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    const result = await removeMember(groupId, userId);
    
    if (result.success) {
      toast.success('Member removed successfully!');
      fetchGroupData();
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await api.delete(`/expenses/${expenseId}`);
      toast.success('Expense deleted successfully!');
      fetchGroupData();
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  const handleEditGroup = () => {
    setEditFormData({
      name: currentGroup.name,
      description: currentGroup.description || ''
    });
    setShowEditGroup(true);
  };

  const handleUpdateGroup = async (e) => {
    e.preventDefault();
    
    if (!editFormData.name.trim()) {
      toast.error('Group name is required');
      return;
    }

    try {
      const response = await api.put(`/groups/${groupId}`, editFormData);
      toast.success('Group updated successfully!');
      setShowEditGroup(false);
      fetchGroupData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update group');
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/groups/${groupId}`);
      toast.success('Group deleted successfully!');
      window.location.href = '/dashboard';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete group');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <div>Loading group data...</div>
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <div>Group not found</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/dashboard" style={{ color: '#6B8DD6' }}>
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 style={{
                fontSize: '2rem',
                color: document.body.classList.contains('dark-mode') ? '#E2E8F0' : '#2D3748',
                marginBottom: '0.5rem'
              }}>
                {currentGroup.name}
              </h1>
              {currentGroup.description && (
                <p style={{ color: document.body.classList.contains('dark-mode') ? '#A0AEC0' : '#718096' }}>{currentGroup.description}</p>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {currentGroup.createdBy._id === user?.id && (
              <>
                <button
                  onClick={handleEditGroup}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  <Edit size={16} />
                  Edit Group
                </button>
                <button
                  onClick={handleDeleteGroup}
                  className="btn btn-danger"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  <Trash2 size={16} />
                  Delete Group
                </button>
              </>
            )}
            <Link
              to={`/group/${groupId}/expense`}
              className="btn btn-primary"
            >
              <Plus size={20} />
              Add Expense
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3">
          {/* Members Section */}
          <div className="card">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.2rem',
                color: document.body.classList.contains('dark-mode') ? '#E2E8F0' : '#2D3748'
              }}>
                Members
              </h2>
              <button
                onClick={() => setShowAddMember(true)}
                className="btn btn-secondary"
                style={{ padding: '0.5rem' }}
              >
                <UserPlus size={16} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentGroup.members.map((member) => (
                <div
                  key={member.user._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: document.body.classList.contains('dark-mode') ? '#2D3748' : '#F7FAFC',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#6B8DD6',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {member.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#E2E8F0' : '#2D3748' }}>
                        {member.user.username}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: document.body.classList.contains('dark-mode') ? '#A0AEC0' : '#718096' }}>
                        {member.user.email}
                      </div>
                    </div>
                  </div>
                  
                  {currentGroup.createdBy._id !== member.user._id && (
                    <button
                      onClick={() => handleRemoveMember(member.user._id)}
                      className="btn btn-danger"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                    >
                      <UserMinus size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Member Modal */}
            {showAddMember && (
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
                <div className="card" style={{ maxWidth: '400px', width: '90%' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Add Member</h3>
                  <form onSubmit={handleAddMember}>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        className="form-input"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => setShowAddMember(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Add Member
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Group Modal */}
            {showEditGroup && (
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
                <div className="card" style={{ maxWidth: '400px', width: '90%' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Edit Group</h3>
                  <form onSubmit={handleUpdateGroup}>
                    <div className="form-group">
                      <label className="form-label">Group Name *</label>
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="form-input"
                        placeholder="Enter group name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea
                        value={editFormData.description}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="form-textarea"
                        placeholder="Enter group description"
                        rows="3"
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => setShowEditGroup(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Update Group
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Balances Section */}
          <div className="card">
            <h2 style={{
              fontSize: '1.2rem',
              color: document.body.classList.contains('dark-mode') ? '#E2E8F0' : '#2D3748',
              marginBottom: '1.5rem'
            }}>
              Balances
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.values(balances).map((balance) => (
                <div
                  key={balance.user._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: document.body.classList.contains('dark-mode') ? '#2D3748' : '#F7FAFC',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#6B8DD6',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {balance.user.username.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#E2E8F0' : '#2D3748' }}>
                      {balance.user.username}
                    </span>
                  </div>
                  
                  <div style={{
                    fontWeight: 'bold',
                    color: balance.balance >= 0 ? '#48BB78' : '#F56565'
                  }}>
                    {balance.balance >= 0 ? '+' : ''}
                    £{Math.abs(balance.balance).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="card">
            <h2 style={{
              fontSize: '1.2rem',
              color: document.body.classList.contains('dark-mode') ? '#E2E8F0' : '#2D3748',
              marginBottom: '1.5rem'
            }}>
              Recent Expenses
            </h2>
            
            {expenses.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: document.body.classList.contains('dark-mode') ? '#A0AEC0' : '#718096'
              }}>
                <DollarSign size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>No expenses yet</p>
                <Link
                  to={`/group/${groupId}/expense`}
                  className="btn btn-primary"
                  style={{ marginTop: '1rem' }}
                >
                  Add First Expense
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {expenses.slice(0, 5).map((expense) => (
                  <div
                    key={expense._id}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#2D3748' : '#F7FAFC',
                      borderRadius: '8px',
                      borderLeft: `4px solid #6B8DD6`
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: '0.5rem'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', color: document.body.classList.contains('dark-mode') ? '#E2E8F0' : '#2D3748' }}>
                          {expense.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: document.body.classList.contains('dark-mode') ? '#A0AEC0' : '#718096' }}>
                          {expense.expenseType} • {expense.splitBetween.length} people
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 'bold', color: '#6B8DD6' }}>
                          £{expense.amountGBP.toFixed(2)}
                        </span>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <Link
                            to={`/group/${groupId}/expense/${expense._id}`}
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={() => handleDeleteExpense(expense._id)}
                            className="btn btn-danger"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                      Paid by {expense.paidBy.username}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
