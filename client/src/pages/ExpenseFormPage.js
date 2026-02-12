import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGroup } from '../context/GroupContext';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import CurrencySelector from '../components/CurrencySelector';
import api from '../services/api';

const ExpenseFormPage = () => {
  const { groupId, expenseId } = useParams();
  const navigate = useNavigate();
  const { currentGroup, fetchGroup } = useGroup();
  const { user } = useAuth();
  const { isDarkMode } = useDarkMode();
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    currency: 'GBP',
    conversionRate: '1.00',
    expenseType: 'other',
    description: '',
    paidBy: '',
    splitBetween: []
  });
  
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const expenseTypes = [
    { value: 'food', label: 'Food & Dining' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'transport', label: 'Transportation' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    if (groupId) {
      fetchGroup(groupId);
    }
    
    if (expenseId) {
      setIsEditing(true);
      fetchExpense();
    } else {
      // Set default values for new expense
      setFormData(prev => ({
        ...prev,
        paidBy: user?.id || '',
        conversionRate: currentGroup?.defaultExchangeRate?.toFixed(2) || '1.00'
      }));
    }
  }, [groupId, expenseId, user?.id, currentGroup?.defaultExchangeRate]);

  const fetchExpense = async () => {
    try {
      const response = await api.get(`/expenses/group/${groupId}`);
      const expense = response.data.expenses.find(e => e._id === expenseId);
      
      if (expense) {
        setFormData({
          title: expense.title,
          amount: expense.amount.toString(),
          currency: expense.currency,
          conversionRate: expense.conversionRate.toFixed(2),
          expenseType: expense.expenseType,
          description: expense.description || '',
          paidBy: expense.paidBy._id,
          splitBetween: expense.splitBetween.map(s => s.user._id)
        });
      }
    } catch (error) {
      toast.error('Failed to load expense');
      navigate(`/group/${groupId}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'conversionRate') {
      // Validate conversion rate format
      const regex = /^\d*\.?\d{0,2}$/;
      if (value === '' || regex.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'amount') {
      // Validate amount
      const regex = /^\d*\.?\d{0,2}$/;
      if (value === '' || regex.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSplitBetweenChange = (userId) => {
    setFormData(prev => ({
      ...prev,
      splitBetween: prev.splitBetween.includes(userId)
        ? prev.splitBetween.filter(id => id !== userId)
        : [...prev.splitBetween, userId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }
    
    if (!formData.conversionRate || parseFloat(formData.conversionRate) < 0) {
      toast.error('Conversion rate must be 0 or greater');
      return;
    }
    
    if (!formData.paidBy) {
      toast.error('Please select who paid');
      return;
    }
    
    if (formData.splitBetween.length === 0) {
      toast.error('Please select at least one person to split between');
      return;
    }

    setLoading(true);
    
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        conversionRate: parseFloat(formData.conversionRate),
        group: groupId
      };

      if (isEditing) {
        await api.put(`/expenses/${expenseId}`, expenseData);
        toast.success('Expense updated successfully!');
      } else {
        await api.post('/expenses', expenseData);
        toast.success('Expense added successfully!');
      }
      
      navigate(`/group/${groupId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await api.delete(`/expenses/${expenseId}`);
      toast.success('Expense deleted successfully!');
      navigate(`/group/${groupId}`);
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  const calculateGBPAmount = () => {
    const amount = parseFloat(formData.amount) || 0;
    const rate = parseFloat(formData.conversionRate) || 1;
    return (amount * rate).toFixed(2);
  };

  if (!currentGroup) {
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
              <Link to={`/group/${groupId}`} style={{ color: '#6B8DD6' }}>
                <ArrowLeft size={24} />
              </Link>
              <h1 style={{
                fontSize: '2rem',
                color: '#2D3748'
              }}>
                {isEditing ? 'Edit Expense' : 'Add Expense'}
              </h1>
            </div>
            
            {isEditing && (
              <button
                onClick={handleDelete}
                className="btn btn-danger"
              >
                <Trash2 size={20} />
                Delete
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="card">
            <div className="grid grid-cols-2">
              {/* Left Column */}
              <div style={{ paddingRight: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="What was this expense for?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Amount *</label>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Currency</label>
                    <CurrencySelector
                      value={formData.currency}
                      onChange={(currency) => setFormData(prev => ({ ...prev, currency: currency }))}
                      placeholder="Select currency"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">1 GBP is: {currentGroup?.defaultExchangeRate ? `(Group Default: ${currentGroup.defaultExchangeRate})` : ''}</label>
                    <input
                      type="text"
                      name="conversionRate"
                      value={formData.conversionRate}
                      onChange={handleChange}
                      className="form-input exchange-rate-field"
                      placeholder={currentGroup?.defaultExchangeRate?.toFixed(2) || '1.00'}
                      required
                    />
                    <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.25rem' }} className="exchange-rate-hint">
                      {currentGroup?.defaultExchangeRate === 0 ? 
                        'All expenses in this group are in GBP' : 
                        `Group default is ${currentGroup?.defaultExchangeRate || '1.00'} - you can override for this expense`
                      }
                    </div>
                  </div>
                </div>

                {formData.currency !== 'GBP' && (
                  <div className="form-group">
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: '#F0F4F8',
                      borderRadius: '8px',
                      border: '2px solid #6B8DD6'
                    }}>
                      <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                        Amount in GBP:
                      </div>
                      <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#6B8DD6'
                      }}>
                        £{calculateGBPAmount()}
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Expense Type</label>
                  <select
                    name="expenseType"
                    value={formData.expenseType}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {expenseTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Add any additional notes..."
                    rows="3"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div style={{ paddingLeft: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Paid By *</label>
                  <select
                    name="paidBy"
                    value={formData.paidBy}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select who paid</option>
                    {currentGroup.members.map(member => (
                      <option key={member.user._id} value={member.user._id}>
                        {member.user.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Split Between *</label>
                  <div className="checkbox-group">
                    {currentGroup.members.map(member => (
                      <div key={member.user._id} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`split-${member.user._id}`}
                          checked={formData.splitBetween.includes(member.user._id)}
                          onChange={() => handleSplitBetweenChange(member.user._id)}
                        />
                        <label htmlFor={`split-${member.user._id}`}>
                          {member.user.username}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.splitBetween.length > 0 && (
                  <div className="form-group">
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: '#F0F4F8',
                      borderRadius: '8px'
                    }}>
                      <div style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '0.5rem' }}>
                        Each person pays:
                      </div>
                      <div style={{
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: '#6B8DD6'
                      }}>
                        £{(parseFloat(calculateGBPAmount()) / formData.splitBetween.length).toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
              marginTop: '2rem',
              paddingTop: '2rem',
              borderTop: '1px solid #E2E8F0'
            }}>
              <Link
                to={`/group/${groupId}`}
                className="btn btn-secondary"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                <Save size={20} />
                {loading ? 'Saving...' : (isEditing ? 'Update Expense' : 'Add Expense')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseFormPage;
