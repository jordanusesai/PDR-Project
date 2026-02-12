import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import Header from './components/Header';
import DarkModeToggle from './components/DarkModeToggle';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GroupPage from './pages/GroupPage';
import ExpenseFormPage from './pages/ExpenseFormPage';
import LoadingSpinner from './components/LoadingSpinner';
import './styles/darkmode.css';
import './styles/App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <DarkModeProvider>
      <div className="App">
        <DarkModeToggle />
        {user && <Header />}
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <DashboardPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/group/:groupId" 
            element={user ? <GroupPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/group/:groupId/expense/:expenseId?" 
            element={user ? <ExpenseFormPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </div>
    </DarkModeProvider>
  );
}

export default App;
