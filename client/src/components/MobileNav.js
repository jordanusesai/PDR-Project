import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { X, Home, Users, LogOut, User } from 'lucide-react';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode } = useDarkMode();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Users size={24} />}
      </button>

      <nav className={`mobile-nav ${isOpen ? 'mobile-nav-open' : ''}`}>
        <Link to="/dashboard" className="mobile-nav-link">
          <Home size={20} />
          Dashboard
        </Link>

        <Link to="/profile" className="mobile-nav-link">
          <User size={20} />
          Profile
        </Link>

        <div className="mobile-nav-user">
          <span className="mobile-nav-username">Welcome, {user?.username}</span>
          <button onClick={handleLogout} className="mobile-nav-logout">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      {isOpen && (
        <div 
          className="mobile-nav-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default MobileNav;
