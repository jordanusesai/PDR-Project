import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { Search } from 'lucide-react';

const currencies = [
  { code: 'USD', name: 'US Dollar', country: 'United States' },
  { code: 'EUR', name: 'Euro', country: 'Austria' },
  { code: 'EUR', name: 'Euro', country: 'Belgium' },
  { code: 'XCD', name: 'Eastern Caribbean Dollar', country: 'Antigua and Barbuda' },
  { code: 'XCD', name: 'Eastern Caribbean Dollar', country: 'Barbados' },
  { code: 'XCD', name: 'Eastern Caribbean Dollar', country: 'Dominica' },
  { code: 'XCD', name: 'Eastern Caribbean Dollar', country: 'Grenada' },
  { code: 'XCD', name: 'Eastern Caribbean Dollar', country: 'Saint Kitts and Nevis' },
  { code: 'XCD', name: 'Eastern Caribbean Dollar', country: 'Saint Lucia' },
  { code: 'XCD', name: 'Eastern Caribbean Dollar', country: 'Saint Vincent and the Grenadines' },
  { code: 'JMD', name: 'Jamaican Dollar', country: 'Jamaica' },
  { code: 'TTD', name: 'Trinidad and Tobago Dollar', country: 'Trinidad and Tobago' },
  { code: 'BBD', name: 'Barbadian Dollar', country: 'Barbados' },
  { code: 'BSD', name: 'Bahamian Dollar', country: 'Bahamas' },
  { code: 'BZD', name: 'Belize Dollar', country: 'Belize' },
  { code: 'KYD', name: 'Cayman Islands Dollar', country: 'Cayman Islands' },
  { code: 'CUP', name: 'Cuban Peso', country: 'Cuba' },
  { code: 'HTG', name: 'Haitian Gourde', country: 'Haiti' },
  { code: 'DOP', name: 'Dominican Peso', country: 'Dominican Republic' },
  { code: 'XOF', name: 'West African CFA Franc', country: 'Benin' },
  { code: 'XOF', name: 'West African CFA Franc', country: 'Burkina Faso' },
  { code: 'XOF', name: 'West African CFA Franc', country: 'Côte d\'Ivoire' },
  { code: 'XOF', name: 'West African CFA Franc', country: 'Guinea-Bissau' },
  { code: 'XOF', name: 'West African CFA Franc', country: 'Mali' },
  { code: 'XOF', name: 'West African CFA Franc', country: 'Niger' },
  { code: 'XOF', name: 'West African CFA Franc', country: 'Senegal' },
  { code: 'XOF', name: 'West African CFA Franc', country: 'Togo' },
].sort((a, b) => a.country.localeCompare(b.country));

const searchCurrencies = (query) => {
  if (!query) return currencies;
  
  const lowerQuery = query.toLowerCase();
  return currencies.filter(currency => 
    currency.code.toLowerCase().includes(lowerQuery) ||
    currency.name.toLowerCase().includes(lowerQuery) ||
    currency.country.toLowerCase().includes(lowerQuery)
  );
};

const CurrencySelector = ({ value, onChange, placeholder = "Select currency" }) => {
  const { isDarkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCurrencies, setFilteredCurrencies] = useState(currencies);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const filtered = searchTerm ? searchCurrencies(searchTerm) : currencies;
    setFilteredCurrencies(filtered);
  }, [searchTerm]);

  const handleSelect = (currency) => {
    onChange(currency.code);
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedCurrency = currencies.find(c => c.code === value);

  const darkModeStyles = {
    backgroundColor: isDarkMode ? '#2D3748' : 'white',
    border: `2px solid ${isDarkMode ? '#4A5568' : '#E2E8F0'}`,
    color: isDarkMode ? '#E2E8F0' : '#2D3748'
  };

  const dropdownStyles = {
    backgroundColor: isDarkMode ? '#2D3748' : 'white',
    border: `2px solid ${isDarkMode ? '#6B8DD6' : '#6B8DD6'}`,
    boxShadow: isDarkMode 
      ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
      : '0 4px 12px rgba(0, 0, 0, 0.15)'
  };

  const inputStyles = {
    backgroundColor: isDarkMode ? '#2D3748' : 'white',
    color: isDarkMode ? '#E2E8F0' : '#2D3748',
    border: `1px solid ${isDarkMode ? '#4A5568' : '#E2E8F0'}`
  };

  const optionStyles = {
    backgroundColor: isDarkMode ? '#2D3748' : 'white',
    color: isDarkMode ? '#E2E8F0' : '#2D3748',
    borderBottom: `1px solid ${isDarkMode ? '#4A5568' : '#F0F4F8'}`
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="form-select"
        style={darkModeStyles}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            color: selectedCurrency ? (isDarkMode ? '#E2E8F0' : '#2D3748') : (isDarkMode ? '#718096' : '#718096'),
            fontSize: '1rem'
          }}>
            {selectedCurrency ? selectedCurrency.name : placeholder}
          </span>
        </div>
        <span style={{ color: isDarkMode ? '#718096' : '#718096' }}>▼</span>
      </button>

      {isOpen && (
        <div style={dropdownStyles}>
          {/* Search Bar */}
          <div style={{ padding: '12px', borderBottom: `1px solid ${isDarkMode ? '#4A5568' : '#E2E8F0'}` }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: isDarkMode ? '#718096' : '#718096' 
              }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search currency..."
                className="form-input"
                style={inputStyles}
                autoFocus
              />
            </div>
          </div>

          {/* Currency List */}
          <div style={{ maxHeight: '250px', overflow: 'auto' }}>
            {filteredCurrencies.map((currency) => (
              <div
                key={`${currency.code}-${currency.country}`}
                onClick={() => handleSelect(currency)}
                style={optionStyles}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#4A5568' : '#F0F4F8'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#2D3748' : 'white'}
              >
                <div style={{
                  fontSize: '1rem',
                  color: isDarkMode ? '#E2E8F0' : '#2D3748',
                  fontWeight: '600'
                }}>
                  {currency.country} - {currency.code}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
