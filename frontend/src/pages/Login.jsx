import React, { useState } from 'react';
import { Activity, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Make a POST request to the Go backend via the Vite proxy (/api)
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      // 2. Check if the response was successful
      if (response.ok && result.success) {
        // Map backend RoleID to a string that the frontend expects
        const roleMap = { 
          1: 'Admin', 
          2: 'Patient', 
          3: 'Doctor', 
          4: 'Receptionist', 
          5: 'Pharmacist' 
        };
        const userRole = roleMap[result.data.roleID] || 'Patient';

        // 3. Update the frontend state
        onLogin({ 
          id: result.data.id,
          name: result.data.firstName, 
          email: result.data.email,
          role: userRole 
        });
        
        navigate('/');
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to the server. Is the backend running?');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Activity size={48} style={{ color: 'var(--primary)' }} />
          <h2>MediCore Login</h2>
          <p>Sign in to access your portal</p>
        </div>
        <form onSubmit={handleLogin}>
          {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@medicore.com" />
            </div>
          </div>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" className="btn-primary w-100 mt-4">Sign In</button>
        </form>
      </div>
    </div>
  );
}
