import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import Tracker from './components/Tracker';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleLoginSuccess = (email) => {
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
  };

  return (
    <div className="app">
      {isLoggedIn ? (
        <Tracker userEmail={userEmail} onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
