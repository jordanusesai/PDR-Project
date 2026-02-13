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
        top: '1rem',
        right: '1rem',
        zIndex: 1000,
        backgroundColor: isDarkMode ? '#4A5568' : '#F7FAFC',
        border: `2px solid ${isDarkMode ? '#6B8DD6' : '#E2E8F0'}`,
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s ease',
      }}
      onMouseOver={(e) => {
        e.target.style.backgroundColor = isDarkMode ? '#5A6FC8' : '#E2E8F0';
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = isDarkMode ? '#4A5568' : '#F7FAFC';
      }}
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <Sun size={24} color="#FCD34D" />
      ) : (
        <Moon size={24} color="#6B8DD6" />
      )}
    </button>
  );
};

export default DarkModeToggle;
