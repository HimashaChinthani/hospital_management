import React, { useState, useEffect } from 'react';
import { Activity, Plus, Users, X } from 'lucide-react';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ Name: '', Phone: '', Email: '', Password: '', DOB: '', Gender: 'Male', BloodGroup: 'A+', Address: '' });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem('medicore_user') || '{}');
  const isAdmin = storedUser.role === 'Admin';

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const patRes = await fetch('/api/patients');
      const patResult = await patRes.json();
      
      if (storedUser.role === 'Doctor') {
        const [appRes, docRes] = await Promise.all([
          fetch('/api/appointments'),
          fetch('/api/doctors')
        ]);
        const aData = await appRes.json();
        const dData = await docRes.json();
        setAppointments(aData.success ? aData.data : []);
        setDoctors(dData.success ? dData.data : []);
      }
      
      if (patRes.ok && patResult.success) {
        const patientsData = patResult.data || [];
        const patientsWithDetails = await Promise.all(
          patientsData.map(async (p) => {
            try {
              const uRes = await fetch(`/api/users/${p.userID}`);
              const uResult = await uRes.json();
              if (uRes.ok && uResult.success) {
                return {
                  ID: p.id,
                  UserID: p.userID,
                  Name: uResult.data.firstName + (uResult.data.lastName ? ' ' + uResult.data.lastName : ''),
                  Phone: uResult.data.phone,
                  Email: uResult.data.email,
                  Status: 'Active',
                  DOB: p.dOB ? p.dOB.split('T')[0] : '',
                  Gender: p.gender || 'Male',
                  BloodGroup: p.bloodGroup || 'A+',
                  Address: p.address || ''
                };
              }
            } catch (e) {
              console.error("Failed to fetch user", p.userID);
            }
            return { ID: p.id, UserID: p.userID, Name: 'Unknown', Phone: 'N/A', Email: 'N/A', Status: 'Active' };
          })
        );
        setPatients(patientsWithDetails);
      } else {
        setError(patResult.error || 'Failed to fetch patients');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
    setFormData({ Name: '', Phone: '', Email: '', Password: '', DOB: '', Gender: 'Male', BloodGroup: 'A+', Address: '' });
  };

  const handleView = (p) => {
    setSelectedPatient(p);
    setFormData({ 
      Name: p.Name || '', 
      Phone: p.Phone || '', 
      Email: p.Email || '', 
      Password: '', 
      DOB: p.DOB || '', 
      Gender: p.Gender || 'Male', 
      BloodGroup: p.BloodGroup || 'A+', 
      Address: p.Address || '' 
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedPatient || !window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      await fetch(`/api/patients/${selectedPatient.ID}`, { method: 'DELETE' });
      await fetch(`/api/users/${selectedPatient.UserID}`, { method: 'DELETE' });
      closeModal();
      fetchPatients();
    } catch (err) {
      alert('Failed to delete patient');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPatient) {
        // UPDATE
        const userRes = await fetch(`/api/users/${selectedPatient.UserID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName: formData.Name, email: formData.Email, phone: formData.Phone, roleID: 2 })
        });
        if (userRes.ok) {
          const patRes = await fetch(`/api/patients/${selectedPatient.ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              userID: selectedPatient.UserID,
              dOB: formData.DOB ? new Date(formData.DOB).toISOString() : new Date('2000-01-01T00:00:00Z').toISOString(),
              gender: formData.Gender, bloodGroup: formData.BloodGroup, address: formData.Address
            })
          });
          if (patRes.ok) {
            closeModal();
            fetchPatients();
          } else alert('Failed to update patient record');
        } else alert('Failed to update user details');
      } else {
        // CREATE
        const userRes = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName: formData.Name, email: formData.Email, password: formData.Password, phone: formData.Phone, roleID: 2 })
        });
        const userResult = await userRes.json();
        
        if (userRes.ok && userResult.success) {
          const patRes = await fetch('/api/patients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              userID: userResult.data.id,
              dOB: formData.DOB ? new Date(formData.DOB).toISOString() : new Date('2000-01-01T00:00:00Z').toISOString(),
              gender: formData.Gender, bloodGroup: formData.BloodGroup, address: formData.Address
            })
          });
          if (patRes.ok) {
            closeModal();
            fetchPatients();
          } else alert('Failed to create patient record');
        } else alert(userResult.error || 'Failed to create user');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit form');
    }
  };

  let displayPatients = patients;
  if (storedUser.role === 'Patient') {
    displayPatients = patients.filter(p => p.Email === storedUser.email);
  } else if (storedUser.role === 'Doctor') {
    const myDoctorRecord = doctors.find(d => d.userID === storedUser.id);
    if (myDoctorRecord) {
      const myPatientIds = appointments.filter(a => a.doctorID === myDoctorRecord.id).map(a => a.patientID);
      displayPatients = patients.filter(p => myPatientIds.includes(p.ID));
    } else {
      displayPatients = [];
    }
  }

  return (
    <section className="data-section">
      <div className="section-header">
        <h2>Recent Patients</h2>
        {isAdmin && (
          <button className="btn-primary" onClick={() => { closeModal(); setShowModal(true); }}>
            <Plus size={18} /> Add Patient
          </button>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '1.5rem'}}>
              <h3 style={{margin:0}}>{selectedPatient ? 'Patient Details' : 'Add New Patient'}</h3>
              <X size={24} style={{cursor:'pointer', color:'var(--text-muted)'}} onClick={closeModal} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input required type="text" value={formData.Name} onChange={e => setFormData({...formData, Name: e.target.value})} placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input required type="text" value={formData.Phone} onChange={e => setFormData({...formData, Phone: e.target.value})} placeholder="+1 234 567 890" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input required type="email" value={formData.Email} onChange={e => setFormData({...formData, Email: e.target.value})} placeholder="john@example.com" />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input required type="date" value={formData.DOB} onChange={e => setFormData({...formData, DOB: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select value={formData.Gender} onChange={e => setFormData({...formData, Gender: e.target.value})}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <select value={formData.BloodGroup} onChange={e => setFormData({...formData, BloodGroup: e.target.value})}>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea required rows="2" value={formData.Address} onChange={e => setFormData({...formData, Address: e.target.value})} style={{width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-main)', fontFamily: 'Outfit'}}></textarea>
              </div>
              {!selectedPatient && (
                <div className="form-group">
                  <label>Login Password</label>
                  <input required type="password" value={formData.Password} onChange={e => setFormData({...formData, Password: e.target.value})} placeholder="Set patient password" />
                </div>
              )}
              <div className="modal-actions" style={{ display: 'flex', justifyContent: selectedPatient && isAdmin ? 'space-between' : 'flex-end', alignItems: 'center' }}>
                {selectedPatient && isAdmin && (
                  <button type="button" onClick={handleDelete} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontFamily: 'Outfit', fontWeight: '500' }}>Delete</button>
                )}
                <div style={{display: 'flex', gap: '1rem'}}>
                  <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn-primary">{selectedPatient ? 'Update Patient' : 'Save Patient'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state"><div className="spinner"></div><p>Loading records...</p></div>
      ) : error ? (
        <div className="loading-state" style={{ color: 'var(--danger)' }}><Activity size={40} /><p>{error}</p></div>
      ) : patients.length === 0 ? (
        <div className="loading-state"><Users size={40} /><p>No patients found.</p></div>
      ) : (
        <table className="glass-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayPatients.map(p => (
              <tr key={p.ID}>
                <td>{p.ID}</td>
                <td>{p.Name || 'Unknown'}</td>
                <td>{p.Phone || p.Email || 'N/A'}</td>
                <td><button onClick={() => handleView(p)} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '5px' }}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
