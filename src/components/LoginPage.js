import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(email);
      setEmail('');
      setPassword('');
    }, 500);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-logo">🚢</div>
          <div>
            <div className="brand-title">Azolla ESD Platform</div>
            <div className="brand-sub">Decarbonisation Suite</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-section-title">Login</div>

          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '🔄 Signing in...' : '→ Sign In'}
          </button>
        </form>

        <div className="login-footer">
          Demo: Use any email and 6+ character password
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
