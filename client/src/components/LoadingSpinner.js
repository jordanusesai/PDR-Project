import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';

const LoadingSpinner = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: isDarkMode ? '#1A202C' : '#F0F4F8'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid ' + (isDarkMode ? '#4A5568' : '#E2E8F0'),
          borderTop: '4px solid #6B8DD6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{
          fontSize: '1.2rem',
          color: '#6B8DD6',
          fontWeight: '600'
        }}>
          PDR Split
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
