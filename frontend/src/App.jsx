import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Prescriptions from './pages/Prescriptions';
import Pharmacy from './pages/Pharmacy';
import Billing from './pages/Billing';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('medicore_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    localStorage.setItem('medicore_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('medicore_user');
    setUser(null);
  };

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Header user={user} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {(user.role === 'Admin' || user.role === 'Receptionist' || user.role === 'Doctor') && <Route path="/patients" element={<Patients />} />}
            {(user.role === 'Admin' || user.role === 'Receptionist' || user.role === 'Patient') && <Route path="/doctors" element={<Doctors />} />}
            {(user.role === 'Admin' || user.role === 'Receptionist' || user.role === 'Doctor' || user.role === 'Patient') && <Route path="/appointments" element={<Appointments />} />}
            {(user.role === 'Admin' || user.role === 'Doctor' || user.role === 'Pharmacist' || user.role === 'Patient') && <Route path="/prescriptions" element={<Prescriptions />} />}
            {(user.role === 'Admin' || user.role === 'Pharmacist') && <Route path="/pharmacy" element={<Pharmacy />} />}
            {(user.role === 'Admin' || user.role === 'Receptionist' || user.role === 'Patient') && <Route path="/billing" element={<Billing />} />}
            {user.role === 'Admin' && <Route path="/reports" element={<Reports />} />}
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
