import React, { useState, useEffect } from 'react';
import { Activity, Plus, FileText, X } from 'lucide-react';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [newDeptName, setNewDeptName] = useState('');
  const [formData, setFormData] = useState({ Name: '', Specialization: '', ContactNo: '', Email: '', Password: '', ExperienceYears: '', DepartmentID: '' });
  const storedUser = JSON.parse(localStorage.getItem('medicore_user') || '{}');
  const isAdmin = storedUser.role === 'Admin';
  const isPatient = storedUser.role === 'Patient';

  const fetchDepartments = async () => {
    try {
      const res = await fetch('/api/departments');
      const result = await res.json();
      if (res.ok && result.success) setDepartments(result.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const docRes = await fetch('/api/doctors');
      const docResult = await docRes.json();
      
      if (docRes.ok && docResult.success) {
        const docsData = docResult.data || [];
        
        const deptRes = await fetch('/api/departments');
        const deptResult = await deptRes.json();
        const depts = deptRes.ok && deptResult.success ? deptResult.data : [];

        const docsWithDetails = await Promise.all(
          docsData.map(async (d) => {
            try {
              const uRes = await fetch(`/api/users/${d.userID}`);
              const uResult = await uRes.json();
              const deptName = depts.find(dp => dp.id === d.departmentID)?.departmentName || 'Unknown';
              
              if (uRes.ok && uResult.success) {
                return {
                  ID: d.id,
                  UserID: d.userID,
                  Name: uResult.data.firstName + (uResult.data.lastName ? ' ' + uResult.data.lastName : ''),
                  ContactNo: uResult.data.phone,
                  Email: uResult.data.email,
                  Specialization: d.specialization,
                  ExperienceYears: d.experienceYears,
                  DepartmentID: d.departmentID,
                  DepartmentName: deptName
                };
              }
            } catch (e) {}
            return { ID: d.id, UserID: d.userID, Name: 'Unknown', Specialization: d.specialization, ContactNo: 'N/A' };
          })
        );
        setDoctors(docsWithDetails);
      } else setError(docResult.error || 'Failed to fetch doctors');
    } catch (err) {
      setError('Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchDoctors();
  }, []);

  const handleAddDepartment = async () => {
    if (!newDeptName) return;
    try {
      const res = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departmentName: newDeptName })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setNewDeptName('');
        await fetchDepartments();
        setFormData({ ...formData, DepartmentID: result.data.id });
      } else alert(result.error || 'Failed to add department');
    } catch (e) {
      alert('Failed to connect');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
    setFormData({ Name: '', Specialization: '', ContactNo: '', Email: '', Password: '', ExperienceYears: '', DepartmentID: '' });
  };

  const handleView = (d) => {
    setSelectedDoctor(d);
    setFormData({ 
      Name: d.Name || '', Specialization: d.Specialization || '', ContactNo: d.ContactNo || '', 
      Email: d.Email || '', Password: '', ExperienceYears: d.ExperienceYears || '', DepartmentID: d.DepartmentID || '' 
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedDoctor || !window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await fetch(`/api/doctors/${selectedDoctor.ID}`, { method: 'DELETE' });
      await fetch(`/api/users/${selectedDoctor.UserID}`, { method: 'DELETE' });
      closeModal();
      fetchDoctors();
    } catch (err) {
      alert('Failed to delete doctor');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDoctor) {
        const userRes = await fetch(`/api/users/${selectedDoctor.UserID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName: formData.Name, email: formData.Email, phone: formData.ContactNo, roleID: 3 })
        });
        if (userRes.ok) {
          const docRes = await fetch(`/api/doctors/${selectedDoctor.ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              userID: selectedDoctor.UserID, departmentID: parseInt(formData.DepartmentID),
              specialization: formData.Specialization, experienceYears: parseInt(formData.ExperienceYears)
            })
          });
          if (docRes.ok) { closeModal(); fetchDoctors(); }
          else alert('Failed to update doctor record');
        } else alert('Failed to update user details');
      } else {
        const userRes = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName: formData.Name, email: formData.Email, password: formData.Password, phone: formData.ContactNo, roleID: 3 })
        });
        const userResult = await userRes.json();
        
        if (userRes.ok && userResult.success) {
          const docRes = await fetch('/api/doctors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              userID: userResult.data.id, departmentID: parseInt(formData.DepartmentID),
              specialization: formData.Specialization, experienceYears: parseInt(formData.ExperienceYears)
            })
          });
          if (docRes.ok) { closeModal(); fetchDoctors(); }
          else alert('Failed to create doctor record');
        } else alert(userResult.error || 'Failed to create user');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit form');
    }
  };

  return (
    <section className="data-section">
      <div className="section-header">
        <h2>Medical Staff</h2>
        {isAdmin && (
          <button className="btn-primary" onClick={() => { closeModal(); setShowModal(true); }}>
            <Plus size={18} /> Add Doctor
          </button>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '1.5rem'}}>
              <h3 style={{margin:0}}>{selectedDoctor ? 'Doctor Details' : 'Register Doctor'}</h3>
              <X size={24} style={{cursor:'pointer', color:'var(--text-muted)'}} onClick={closeModal} />
            </div>
            {isPatient ? (
              <div style={{ marginTop: '1rem', fontSize: '1.1rem', lineHeight: '1.8' }}>
                <p><strong>Name:</strong> {formData.Name}</p>
                <p><strong>Specialization:</strong> {formData.Specialization}</p>
                <p><strong>Department:</strong> {departments.find(d => d.id === parseInt(formData.DepartmentID))?.departmentName || 'Unknown'}</p>
                <p><strong>Experience:</strong> {formData.ExperienceYears} Years</p>
                <p><strong>Contact:</strong> {formData.ContactNo}</p>
                <p><strong>Email:</strong> {formData.Email}</p>
                <div className="modal-actions" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn-secondary" onClick={closeModal}>Close</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Doctor Name</label>
                  <input required type="text" value={formData.Name} onChange={e => setFormData({...formData, Name: e.target.value})} placeholder="Dr. Sarah Smith" />
                </div>
                <div className="form-group">
                  <label>Specialization</label>
                  <input required type="text" value={formData.Specialization} onChange={e => setFormData({...formData, Specialization: e.target.value})} placeholder="Cardiology" />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                    <select required value={formData.DepartmentID} onChange={e => setFormData({...formData, DepartmentID: e.target.value})} style={{flex: 1}}>
                      <option value="">Select Department</option>
                      {departments.map(dp => (
                        <option key={dp.id} value={dp.id}>{dp.departmentName}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{display: 'flex', gap: '10px'}}>
                    <input type="text" value={newDeptName} onChange={e => setNewDeptName(e.target.value)} placeholder="New Department Name" style={{flex: 1}} />
                    <button type="button" onClick={handleAddDepartment} className="btn-secondary" style={{padding: '0 15px'}}>Add</button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Experience (Years)</label>
                  <input required type="number" min="0" value={formData.ExperienceYears} onChange={e => setFormData({...formData, ExperienceYears: e.target.value})} placeholder="e.g. 5" />
                </div>
                <div className="form-group">
                  <label>Contact No</label>
                  <input required type="text" value={formData.ContactNo} onChange={e => setFormData({...formData, ContactNo: e.target.value})} placeholder="+1 234 567 890" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input required type="email" value={formData.Email} onChange={e => setFormData({...formData, Email: e.target.value})} placeholder="doctor@example.com" />
                </div>
                {!selectedDoctor && (
                  <div className="form-group">
                    <label>Login Password</label>
                    <input required type="password" value={formData.Password} onChange={e => setFormData({...formData, Password: e.target.value})} placeholder="Set doctor password" />
                  </div>
                )}
                <div className="modal-actions" style={{ display: 'flex', justifyContent: selectedDoctor && isAdmin ? 'space-between' : 'flex-end', alignItems: 'center' }}>
                  {selectedDoctor && isAdmin && (
                    <button type="button" onClick={handleDelete} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontFamily: 'Outfit', fontWeight: '500' }}>Delete</button>
                  )}
                  <div style={{display: 'flex', gap: '1rem'}}>
                    <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="btn-primary">{selectedDoctor ? 'Update Doctor' : 'Save Doctor'}</button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state"><div className="spinner"></div><p>Loading records...</p></div>
      ) : error ? (
        <div className="loading-state" style={{ color: 'var(--danger)' }}><Activity size={40} /><p>{error}</p></div>
      ) : doctors.length === 0 ? (
        <div className="loading-state"><FileText size={40} /><p>No doctors found.</p></div>
      ) : (
        <table className="glass-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Specialization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(d => (
              <tr key={d.ID}>
                <td>{d.ID}</td>
                <td>{d.Name}</td>
                <td>{d.DepartmentName || 'N/A'}</td>
                <td>{d.Specialization}</td>
                <td><button onClick={() => handleView(d)} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '5px' }}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
