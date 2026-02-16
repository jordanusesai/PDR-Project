import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { LogOut, Home, User } from 'lucide-react';
import MobileNav from './MobileNav';

const Header = () => {
  const { user, logout } = useAuth();
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      backgroundColor: '#6B8DD6',
      color: 'white',
      padding: '1rem 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/dashboard" style={{
            textDecoration: 'none',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <img 
              src="/pdr-logo.png" 
              alt="PDR Logo" 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                objectFit: 'cover'
              }}
            />
            PDR Split
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link to="/dashboard" style={{
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              transition: 'background-color 0.2s'
            }}>
              <Home size={20} />
              Dashboard
            </Link>

            <Link to="/profile" style={{
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              transition: 'background-color 0.2s'
            }}>
              <User size={20} />
              Profile
            </Link>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span style={{
                fontSize: '0.9rem',
                opacity: 0.9
              }}>
                Welcome, {user?.username}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid white',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </header>
  );
};

export default Header;