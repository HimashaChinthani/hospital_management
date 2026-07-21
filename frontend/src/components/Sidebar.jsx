import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Users, FileText, Calendar, Pill, Receipt, BarChart, Settings, LogOut } from 'lucide-react';

export default function Sidebar({ user, onLogout }) {
  const role = user?.role || '';
  const canSeePatients = ['Admin', 'Doctor', 'Receptionist'].includes(role);
  const canSeeDoctors = ['Admin', 'Receptionist', 'Patient'].includes(role);
  const canSeeAppointments = ['Admin', 'Doctor', 'Receptionist', 'Patient'].includes(role);
  const canSeePrescriptions = ['Admin', 'Doctor', 'Pharmacist', 'Patient'].includes(role);
  const canSeePharmacy = ['Admin', 'Pharmacist'].includes(role);
  const canSeeBilling = ['Admin', 'Receptionist', 'Patient'].includes(role);
  const canSeeReports = ['Admin'].includes(role);

  return (
    <aside className="sidebar">
      <div className="logo-area">
        <Activity size={28} />
        <span>MediCore</span>
      </div>
      
      <nav className="nav-menu">
        <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Activity size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        {canSeePatients && (
          <NavLink to="/patients" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <Users size={20} />
            <span>Patients</span>
          </NavLink>
        )}
        
        {canSeeDoctors && (
          <NavLink to="/doctors" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <FileText size={20} />
            <span>Doctors</span>
          </NavLink>
        )}
        
        {canSeeAppointments && (
          <NavLink to="/appointments" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <Calendar size={20} />
            <span>Appointments</span>
          </NavLink>
        )}
        
        {canSeePrescriptions && (
          <NavLink to="/prescriptions" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <FileText size={20} />
            <span>Prescriptions</span>
          </NavLink>
        )}
        
        {canSeePharmacy && (
          <NavLink to="/pharmacy" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <Pill size={20} />
            <span>Pharmacy</span>
          </NavLink>
        )}
        
        {canSeeBilling && (
          <NavLink to="/billing" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <Receipt size={20} />
            <span>Billing</span>
          </NavLink>
        )}
        
        {canSeeReports && (
          <NavLink to="/reports" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <BarChart size={20} />
            <span>Reports</span>
          </NavLink>
        )}
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ padding: '0 20px', marginBottom: '10px', fontSize: '0.8rem', color: 'var(--primary)' }}>
          Logged in as: {role}
        </div>
        <nav className="nav-menu">
          <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); onLogout(); }}>
            <LogOut size={20} />
            <span>Logout</span>
          </a>
        </nav>
      </div>
    </aside>
  );
}
