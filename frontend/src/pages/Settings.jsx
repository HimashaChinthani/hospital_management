import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Bell, Shield, User } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({ name: '', email: '' });
  const storedUser = JSON.parse(localStorage.getItem('medicore_user') || '{}');

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!storedUser.id) return;
      try {
        const res = await fetch(`/api/users/${storedUser.id}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setUserData({
            name: data.data.firstName + (data.data.lastName ? ' ' + data.data.lastName : ''),
            email: data.data.email
          });
        }
      } catch (err) {
        console.error("Failed to fetch user details", err);
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <section className="data-section" style={{ minHeight: '80vh' }}>
      <div className="section-header" style={{ marginBottom: '2rem' }}>
        <h2><SettingsIcon size={24} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> System Settings</h2>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Settings Sidebar */}
        <div style={{ width: '250px', background: 'var(--glass-bg)', padding: '1rem', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li 
              onClick={() => setActiveTab('profile')}
              style={{ padding: '12px 15px', cursor: 'pointer', borderRadius: '10px', marginBottom: '5px', background: activeTab === 'profile' ? 'var(--primary)' : 'transparent', color: activeTab === 'profile' ? 'white' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={18} /> My Profile
            </li>
            <li 
              onClick={() => setActiveTab('notifications')}
              style={{ padding: '12px 15px', cursor: 'pointer', borderRadius: '10px', marginBottom: '5px', background: activeTab === 'notifications' ? 'var(--primary)' : 'transparent', color: activeTab === 'notifications' ? 'white' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bell size={18} /> Notifications
            </li>
            <li 
              onClick={() => setActiveTab('security')}
              style={{ padding: '12px 15px', cursor: 'pointer', borderRadius: '10px', marginBottom: '5px', background: activeTab === 'security' ? 'var(--primary)' : 'transparent', color: activeTab === 'security' ? 'white' : 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={18} /> Security
            </li>
          </ul>
        </div>

        {/* Settings Content */}
        <div style={{ flex: 1, background: 'var(--glass-bg)', padding: '2rem', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
          {activeTab === 'profile' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Profile Information</h3>
              <div className="form-group">
                <label>Display Name</label>
                <input type="text" value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} />
              </div>
              <button className="btn-primary" style={{ marginTop: '1rem' }}><Save size={18} style={{ marginRight: '8px' }} /> Save Changes</button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Notification Preferences</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked /> Email alerts for new appointments
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked /> System alerts for low stock
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" /> Daily summary reports
              </label>
              <button className="btn-primary" style={{ marginTop: '1rem' }}><Save size={18} style={{ marginRight: '8px' }} /> Update Preferences</button>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Security Settings</h3>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" placeholder="New Password" />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" placeholder="Confirm Password" />
              </div>
              <button className="btn-primary" style={{ marginTop: '1rem' }}><Save size={18} style={{ marginRight: '8px' }} /> Update Password</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
