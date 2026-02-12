import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { Moon, Sun } from 'lucide-react';

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        backgroundColor: isDarkMode ? '#4A5568' : '#F7FAFC',
        border: `2px solid ${isDarkMode ? '#718096' : '#E2E8F0'}`,
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: isDarkMode 
          ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
          : '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {isDarkMode ? (
        <Sun 
          size={24} 
          color="#FBD38D"
          style={{ transition: 'all 0.3s ease' }}
        />
      ) : (
        <Moon 
          size={24} 
          color="#4A5568"
          style={{ transition: 'all 0.3s ease' }}
        />
      )}
    </button>
  );
};

export default DarkModeToggle;
