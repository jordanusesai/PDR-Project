import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import './ExpenseFormPage.css';
import { useGroup } from '../context/GroupContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

const ExpenseFormPage = () => {
  const { groupId, expenseId } = useParams();
  const navigate = useNavigate();
  const { currentGroup, fetchGroup } = useGroup();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    currency: 'United Kingdom-GBP',
    conversionRate: '1.00',
    expenseType: 'food',
    description: '',
    paidBy: '',
    splitBetween: []
  });
  
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Currency search state
  const [currencySearchOpen, setCurrencySearchOpen] = useState(false);
  const [currencySearchTerm, setCurrencySearchTerm] = useState('United Kingdom - GBP');
  const [selectedCurrencyIndex, setSelectedCurrencyIndex] = useState(-1);

  const currencies = [
    // Popular Currencies (Top of List)
    { code: 'GBP', name: 'British Pound', country: 'United Kingdom' },
    { code: 'USD', name: 'US Dollar', country: 'United States' },
    { code: '---', name: '---', country: '------------------------' },
    
    // European Currencies (Alphabetical)
    { code: 'EUR', name: 'Euro', country: 'Austria' },
    { code: 'EUR', name: 'Euro', country: 'Belgium' },
    { code: 'EUR', name: 'Euro', country: 'Cyprus' },
    { code: 'EUR', name: 'Euro', country: 'Estonia' },
    { code: 'EUR', name: 'Euro', country: 'Finland' },
    { code: 'EUR', name: 'Euro', country: 'France' },
    { code: 'EUR', name: 'Euro', country: 'Germany' },
    { code: 'EUR', name: 'Euro', country: 'Greece' },
    { code: 'EUR', name: 'Euro', country: 'Ireland' },
    { code: 'EUR', name: 'Euro', country: 'Italy' },
    { code: 'EUR', name: 'Euro', country: 'Latvia' },
    { code: 'EUR', name: 'Euro', country: 'Lithuania' },
    { code: 'EUR', name: 'Euro', country: 'Luxembourg' },
    { code: 'EUR', name: 'Euro', country: 'Malta' },
    { code: 'EUR', name: 'Euro', country: 'Netherlands' },
    { code: 'EUR', name: 'Euro', country: 'Portugal' },
    { code: 'EUR', name: 'Euro', country: 'Slovakia' },
    { code: 'EUR', name: 'Euro', country: 'Slovenia' },
    { code: 'EUR', name: 'Euro', country: 'Spain' },
    { code: 'CHF', name: 'Swiss Franc', country: 'Switzerland' },
    { code: 'NOK', name: 'Norwegian Krone', country: 'Norway' },
    { code: 'SEK', name: 'Swedish Krona', country: 'Sweden' },
    { code: 'DKK', name: 'Danish Krone', country: 'Denmark' },
    { code: 'ISK', name: 'Icelandic Krona', country: 'Iceland' },
    { code: 'PLN', name: 'Polish Zloty', country: 'Poland' },
    { code: 'CZK', name: 'Czech Koruna', country: 'Czech Republic' },
    { code: 'HUF', name: 'Hungarian Forint', country: 'Hungary' },
    { code: 'RON', name: 'Romanian Leu', country: 'Romania' },
    { code: 'BGN', name: 'Bulgarian Lev', country: 'Bulgaria' },
    { code: 'HRK', name: 'Croatian Kuna', country: 'Croatia' },
    { code: 'RSD', name: 'Serbian Dinar', country: 'Serbia' },
    { code: 'BAM', name: 'Bosnian Mark', country: 'Bosnia' },
    { code: 'MKD', name: 'Macedonian Denar', country: 'North Macedonia' },
    { code: 'ALL', name: 'Albanian Lek', country: 'Albania' },
    { code: 'MDL', name: 'Moldovan Leu', country: 'Moldova' },
    { code: 'UAH', name: 'Ukrainian Hryvnia', country: 'Ukraine' },
    { code: 'BYN', name: 'Belarusian Ruble', country: 'Belarus' },
    
    // Caribbean Currencies (Alphabetical)
    { code: 'AWG', name: 'Aruban Florin', country: 'Aruba' },
    { code: 'BBD', name: 'Barbadian Dollar', country: 'Barbados' },
    { code: 'BZD', name: 'Belize Dollar', country: 'Belize' },
    { code: 'KYD', name: 'Cayman Dollar', country: 'Cayman Islands' },
    { code: 'COP', name: 'Colombian Peso', country: 'Colombia' },
    { code: 'CUP', name: 'Cuban Peso', country: 'Cuba' },
    { code: 'DOP', name: 'Dominican Peso', country: 'Dominican Republic' },
    { code: 'XCD', name: 'East Caribbean Dollar', country: 'East Caribbean States' },
    { code: 'GTQ', name: 'Guatemalan Quetzal', country: 'Guatemala' },
    { code: 'HTG', name: 'Haitian Gourde', country: 'Haiti' },
    { code: 'JMD', name: 'Jamaican Dollar', country: 'Jamaica' },
    { code: 'NIO', name: 'Nicaraguan Cordoba', country: 'Nicaragua' },
    { code: 'XOF', name: 'West African CFA Franc', country: 'West African States' },
    { code: 'TTD', name: 'Trinidad Dollar', country: 'Trinidad and Tobago' },
    { code: 'UYU', name: 'Uruguayan Peso', country: 'Uruguay' },
    { code: 'VES', name: 'Venezuelan Bolivar', country: 'Venezuela' },
    
    // Asian Currencies (Alphabetical)
    { code: 'AFN', name: 'Afghan Afghani', country: 'Afghanistan' },
    { code: 'BHD', name: 'Bahraini Dinar', country: 'Bahrain' },
    { code: 'BDT', name: 'Bangladeshi Taka', country: 'Bangladesh' },
    { code: 'BWP', name: 'Botswana Pula', country: 'Botswana' },
    { code: 'BRL', name: 'Brazilian Real', country: 'Brazil' },
    { code: 'BND', name: 'Brunei Dollar', country: 'Brunei' },
    { code: 'BIF', name: 'Burundian Franc', country: 'Burundi' },
    { code: 'KHR', name: 'Cambodian Riel', country: 'Cambodia' },
    { code: 'CAD', name: 'Canadian Dollar', country: 'Canada' },
    { code: 'CVE', name: 'Cape Verdean Escudo', country: 'Cape Verde' },
    { code: 'CLP', name: 'Chilean Peso', country: 'Chile' },
    { code: 'CNY', name: 'Chinese Yuan', country: 'China' },
    { code: 'COP', name: 'Colombian Peso', country: 'Colombia' },
    { code: 'CDF', name: 'Congolese Franc', country: 'DR Congo' },
    { code: 'CRC', name: 'Costa Rican Colon', country: 'Costa Rica' },
    { code: 'HRK', name: 'Croatian Kuna', country: 'Croatia' },
    { code: 'CUP', name: 'Cuban Peso', country: 'Cuba' },
    { code: 'CZK', name: 'Czech Koruna', country: 'Czech Republic' },
    { code: 'DKK', name: 'Danish Krone', country: 'Denmark' },
    { code: 'DJF', name: 'Djiboutian Franc', country: 'Djibouti' },
    { code: 'DOP', name: 'Dominican Peso', country: 'Dominican Republic' },
    { code: 'XCD', name: 'East Caribbean Dollar', country: 'East Caribbean' },
    { code: 'EGP', name: 'Egyptian Pound', country: 'Egypt' },
    { code: 'ERN', name: 'Eritrean Nakfa', country: 'Eritrea' },
    { code: 'ETB', name: 'Ethiopian Birr', country: 'Ethiopia' },
    { code: 'EUR', name: 'Euro', country: 'Eurozone' },
    { code: 'FJD', name: 'Fijian Dollar', country: 'Fiji' },
    { code: 'GMD', name: 'Gambian Dalasi', country: 'Gambia' },
    { code: 'GEL', name: 'Georgian Lari', country: 'Georgia' },
    { code: 'GHS', name: 'Ghanaian Cedi', country: 'Ghana' },
    { code: 'GTQ', name: 'Guatemalan Quetzal', country: 'Guatemala' },
    { code: 'GNF', name: 'Guinean Franc', country: 'Guinea' },
    { code: 'GYD', name: 'Guyanese Dollar', country: 'Guyana' },
    { code: 'HTG', name: 'Haitian Gourde', country: 'Haiti' },
    { code: 'HNL', name: 'Honduran Lempira', country: 'Honduras' },
    { code: 'HKD', name: 'Hong Kong Dollar', country: 'Hong Kong' },
    { code: 'HUF', name: 'Hungarian Forint', country: 'Hungary' },
    { code: 'ISK', name: 'Icelandic Krona', country: 'Iceland' },
    { code: 'INR', name: 'Indian Rupee', country: 'India' },
    { code: 'IDR', name: 'Indonesian Rupiah', country: 'Indonesia' },
    { code: 'IRR', name: 'Iranian Rial', country: 'Iran' },
    { code: 'IQD', name: 'Iraqi Dinar', country: 'Iraq' },
    { code: 'ILS', name: 'Israeli Shekel', country: 'Israel' },
    { code: 'JMD', name: 'Jamaican Dollar', country: 'Jamaica' },
    { code: 'JPY', name: 'Japanese Yen', country: 'Japan' },
    { code: 'JOD', name: 'Jordanian Dinar', country: 'Jordan' },
    { code: 'KZT', name: 'Kazakhstani Tenge', country: 'Kazakhstan' },
    { code: 'KES', name: 'Kenyan Shilling', country: 'Kenya' },
    { code: 'KRW', name: 'South Korean Won', country: 'South Korea' },
    { code: 'KWD', name: 'Kuwaiti Dinar', country: 'Kuwait' },
    { code: 'KGS', name: 'Kyrgyzstani Som', country: 'Kyrgyzstan' },
    { code: 'LAK', name: 'Lao Kip', country: 'Laos' },
    { code: 'LBP', name: 'Lebanese Pound', country: 'Lebanon' },
    { code: 'LSL', name: 'Lesotho Loti', country: 'Lesotho' },
    { code: 'LRD', name: 'Liberian Dollar', country: 'Liberia' },
    { code: 'LYD', name: 'Libyan Dinar', country: 'Libya' },
    { code: 'MOP', name: 'Macanese Pataca', country: 'Macau' },
    { code: 'MKD', name: 'Macedonian Denar', country: 'North Macedonia' },
    { code: 'MGF', name: 'Malagasy Franc', country: 'Madagascar' },
    { code: 'MWK', name: 'Malawian Kwacha', country: 'Malawi' },
    { code: 'MYR', name: 'Malaysian Ringgit', country: 'Malaysia' },
    { code: 'MVR', name: 'Maldivian Rufiyaa', country: 'Maldives' },
    { code: 'MRO', name: 'Mauritanian Ouguiya', country: 'Mauritania' },
    { code: 'MUR', name: 'Mauritian Rupee', country: 'Mauritius' },
    { code: 'MXN', name: 'Mexican Peso', country: 'Mexico' },
    { code: 'MDL', name: 'Moldovan Leu', country: 'Moldova' },
    { code: 'MNT', name: 'Mongolian Tugrik', country: 'Mongolia' },
    { code: 'MAD', name: 'Moroccan Dirham', country: 'Morocco' },
    { code: 'MZN', name: 'Mozambican Metical', country: 'Mozambique' },
    { code: 'MMK', name: 'Myanmar Kyat', country: 'Myanmar' },
    { code: 'NAD', name: 'Namibian Dollar', country: 'Namibia' },
    { code: 'NPR', name: 'Nepalese Rupee', country: 'Nepal' },
    { code: 'NIO', name: 'Nicaraguan Cordoba', country: 'Nicaragua' },
    { code: 'NGN', name: 'Nigerian Naira', country: 'Nigeria' },
    { code: 'NOK', name: 'Norwegian Krone', country: 'Norway' },
    { code: 'OMR', name: 'Omani Rial', country: 'Oman' },
    { code: 'PKR', name: 'Pakistani Rupee', country: 'Pakistan' },
    { code: 'PAB', name: 'Panamanian Balboa', country: 'Panama' },
    { code: 'PGK', name: 'Papua New Guinean Kina', country: 'Papua New Guinea' },
    { code: 'PYG', name: 'Paraguayan Guarani', country: 'Paraguay' },
    { code: 'PEN', name: 'Peruvian Sol', country: 'Peru' },
    { code: 'PHP', name: 'Philippine Peso', country: 'Philippines' },
    { code: 'PLN', name: 'Polish Zloty', country: 'Poland' },
    { code: 'QAR', name: 'Qatari Riyal', country: 'Qatar' },
    { code: 'RON', name: 'Romanian Leu', country: 'Romania' },
    { code: 'RUB', name: 'Russian Ruble', country: 'Russia' },
    { code: 'RWF', name: 'Rwandan Franc', country: 'Rwanda' },
    { code: 'SVC', name: 'Salvadoran Colon', country: 'El Salvador' },
    { code: 'WST', name: 'Samoan Tala', country: 'Samoa' },
    { code: 'SAR', name: 'Saudi Riyal', country: 'Saudi Arabia' },
    { code: 'RSD', name: 'Serbian Dinar', country: 'Serbia' },
    { code: 'SCR', name: 'Seychellois Rupee', country: 'Seychelles' },
    { code: 'SLL', name: 'Sierra Leonean Leone', country: 'Sierra Leone' },
    { code: 'SGD', name: 'Singapore Dollar', country: 'Singapore' },
    { code: 'SBD', name: 'Solomon Islands Dollar', country: 'Solomon Islands' },
    { code: 'SOS', name: 'Somali Shilling', country: 'Somalia' },
    { code: 'ZAR', name: 'South African Rand', country: 'South Africa' },
    { code: 'KRW', name: 'South Korean Won', country: 'South Korea' },
    { code: 'SSP', name: 'South Sudanese Pound', country: 'South Sudan' },
    { code: 'LKR', name: 'Sri Lankan Rupee', country: 'Sri Lanka' },
    { code: 'SDG', name: 'Sudanese Pound', country: 'Sudan' },
    { code: 'SRD', name: 'Surinamese Dollar', country: 'Suriname' },
    { code: 'SZL', name: 'Swazi Lilangeni', country: 'Eswatini' },
    { code: 'SEK', name: 'Swedish Krona', country: 'Sweden' },
    { code: 'CHF', name: 'Swiss Franc', country: 'Switzerland' },
    { code: 'SYP', name: 'Syrian Pound', country: 'Syria' },
    { code: 'TWD', name: 'Taiwan Dollar', country: 'Taiwan' },
    { code: 'TJS', name: 'Tajikistani Somoni', country: 'Tajikistan' },
    { code: 'TZS', name: 'Tanzanian Shilling', country: 'Tanzania' },
    { code: 'THB', name: 'Thai Baht', country: 'Thailand' },
    { code: 'TOP', name: 'Tongan Paʻanga', country: 'Tonga' },
    { code: 'TTD', name: 'Trinidad Dollar', country: 'Trinidad & Tobago' },
    { code: 'TND', name: 'Tunisian Dinar', country: 'Tunisia' },
    { code: 'TRY', name: 'Turkish Lira', country: 'Turkey' },
    { code: 'TMT', name: 'Turkmenistani Manat', country: 'Turkmenistan' },
    { code: 'UGX', name: 'Ugandan Shilling', country: 'Uganda' },
    { code: 'UAH', name: 'Ukrainian Hryvnia', country: 'Ukraine' },
    { code: 'AED', name: 'UAE Dirham', country: 'UAE' },
    { code: 'UYU', name: 'Uruguayan Peso', country: 'Uruguay' },
    { code: 'UZS', name: 'Uzbekistani Som', country: 'Uzbekistan' },
    { code: 'VUV', name: 'Vanuatu Vatu', country: 'Vanuatu' },
    { code: 'VEF', name: 'Venezuelan Bolivar', country: 'Venezuela' },
    { code: 'VND', name: 'Vietnamese Dong', country: 'Vietnam' },
    { code: 'YER', name: 'Yemeni Rial', country: 'Yemen' },
    { code: 'ZMW', name: 'Zambian Kwacha', country: 'Zambia' },
    { code: 'ZWL', name: 'Zimbabwean Dollar', country: 'Zimbabwe' }
  ].sort((a, b) => a.country.localeCompare(b.country));

  // Get display text for currency
  const getCurrencyDisplay = (currencyCode) => {
    // Find the exact currency object that matches the stored value
    const found = currencies.find(c => `${c.country}-${c.code}` === currencyCode);
    if (found) {
      return `${found.country} - ${found.code}`;
    }
    
    // Fallback for old format (just currency code)
    const fallback = currencies.find(c => c.code === currencyCode);
    return fallback ? `${fallback.country} - ${fallback.code}` : currencyCode;
  };

  // Get currently selected currency object
  const selectedCurrency = currencies.find(c => c.code === formData.currency);

  // Filter currencies based on search term
  const filteredCurrencies = currencies.filter(currency => {
    // Skip separator entries
    if (currency.code === '---') {
      return false;
    }
    
    // If no search term, show all currencies
    if (!currencySearchTerm.trim()) {
      return true;
    }
    
    const searchTerm = currencySearchTerm.toLowerCase();
    const countryMatch = currency.country.toLowerCase().includes(searchTerm);
    const nameMatch = currency.name.toLowerCase().includes(searchTerm);
    const codeMatch = currency.code.toLowerCase().includes(searchTerm);
    
    return countryMatch || nameMatch || codeMatch;
  });

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
        paidBy: user?.id || ''
      }));
    }
  }, [groupId, expenseId, user?.id]);

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

  // Currency search handlers
  const handleCurrencySearchClick = () => {
    setCurrencySearchOpen(true);
    // Clear search term when clicked to allow fresh search
    setCurrencySearchTerm('');
    setSelectedCurrencyIndex(-1);
  };

  const handleCurrencySearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setCurrencySearchTerm(newSearchTerm);
    setCurrencySearchOpen(true);
    setSelectedCurrencyIndex(-1);
  };

  const handleCurrencySelect = (currency) => {
    setFormData(prev => ({ ...prev, currency: `${currency.country}-${currency.code}` }));
    setCurrencySearchOpen(false);
    // Show selected currency after selection
    setCurrencySearchTerm(getCurrencyDisplay(`${currency.country}-${currency.code}`));
    setSelectedCurrencyIndex(-1);
  };

  const handleCurrencyKeyDown = (e) => {
    if (!currencySearchOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedCurrencyIndex(prev => 
          prev < filteredCurrencies.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedCurrencyIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedCurrencyIndex >= 0 && filteredCurrencies[selectedCurrencyIndex]) {
          handleCurrencySelect(filteredCurrencies[selectedCurrencyIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setCurrencySearchOpen(false);
        setSelectedCurrencyIndex(-1);
        break;
    }
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
    
    if (!formData.conversionRate || parseFloat(formData.conversionRate) <= 0) {
      toast.error('Conversion rate must be greater than 0');
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
    return (amount / rate).toFixed(2);
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
                    <div className="currency-search-container">
                      <input
                        type="text"
                        value={currencySearchOpen ? currencySearchTerm : (currencySearchTerm ? currencySearchTerm : getCurrencyDisplay(formData.currency))}
                        onChange={handleCurrencySearchChange}
                        onClick={handleCurrencySearchClick}
                        onKeyDown={handleCurrencyKeyDown}
                        onFocus={handleCurrencySearchClick}
                        placeholder="Search currency..."
                        className="form-input"
                        style={{ 
                          cursor: 'pointer',
                          backgroundColor: currencySearchOpen ? '#ffffff' : '#f7fafc'
                        }}
                      />
                      
                      {currencySearchOpen && (
                        <div className="currency-search-dropdown">
                          {filteredCurrencies.length > 0 ? (
                            filteredCurrencies.map((currency, index) => {
                              // Add separator class for the dashed line
                              const isSeparator = currency.code === '---';
                              const isSelected = `${currency.country}-${currency.code}` === formData.currency;
                              return (
                                <div
                                  key={`${currency.code}-${currency.country}-${index}`}
                                  onMouseDown={() => !isSeparator && handleCurrencySelect(currency)}
                                  className={`${isSeparator ? 'separator' : ''} ${isSelected ? 'selected' : ''} ${index === selectedCurrencyIndex ? 'highlighted' : ''}`}
                                >
                                  {currency.country} - {currency.code}
                                </div>
                              );
                            })
                          ) : (
                            <div className="no-results">
                              No currencies found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">One GBP is: *</label>
                    <input
                      type="text"
                      name="conversionRate"
                      value={formData.conversionRate}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="1.00"
                      required
                    />
                    <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.25rem' }}>
                      Enter how many local currency units equal 1 GBP
                    </div>
                  </div>
                </div>

                {formData.currency !== 'GBP' && (
                  <div className="form-group">
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: document.body.classList.contains('dark-mode') ? '#2D3748' : '#F0F4F8',
                      borderRadius: '8px',
                      border: '2px solid #6B8DD6'
                    }}>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: document.body.classList.contains('dark-mode') ? '#E2E8F0' : '#718096' 
                      }}>
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
                  <div className="member-checkbox-container">
                    {currentGroup.members.map(member => (
                      <div key={member.user._id} className="member-checkbox-item">
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
                    <div className="each-person-pays-container">
                      <div className="each-person-pays-item">
                        <label>Each person pays:</label>
                        <div style={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          color: '#6B8DD6'
                        }}>
                          £{(parseFloat(calculateGBPAmount()) / formData.splitBetween.length).toFixed(2)}
                        </div>
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
