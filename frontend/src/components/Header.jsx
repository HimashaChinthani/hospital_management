import React from 'react';
import { User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Header({ user }) {
  const location = useLocation();
  
  const getTitle = () => {
    switch(location.pathname) {
      case '/': return 'Overview';
      case '/patients': return 'Patient Management';
      case '/doctors': return 'Medical Staff';
      case '/appointments': return 'Appointments Schedule';
      case '/prescriptions': return 'Prescriptions';
      case '/pharmacy': return 'Pharmacy Inventory';
      case '/billing': return 'Billing & Payments';
      case '/reports': return 'Hospital Reports';
      default: return 'MediCore System';
    }
  };

  return (
    <header className="top-header">
      <h1>{getTitle()}</h1>
      <div className="user-profile">
        <User size={18} />
        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
          {user ? `${user.name} (${user.role})` : 'Portal'}
        </span>
      </div>
    </header>
  );
}
