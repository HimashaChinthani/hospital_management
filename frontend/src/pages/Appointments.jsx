import React, { useState, useEffect } from 'react';
import { Activity, Plus, Calendar, X } from 'lucide-react';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({ PatientID: '', DoctorID: '', AppointmentDate: '', AppointmentTime: '', Status: 'Scheduled' });
  const storedUser = JSON.parse(localStorage.getItem('medicore_user') || '{}');
  const isPatient = storedUser.role === 'Patient';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appRes, patRes, docRes] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/patients'),
        fetch('/api/doctors')
      ]);

      const appData = await appRes.json();
      const patData = await patRes.json();
      const docData = await docRes.json();

      let mappedPatients = [];
      let mappedDoctors = [];

      if (patData.success) {
        mappedPatients = await Promise.all((patData.data || []).map(async p => {
          try {
            const uRes = await fetch(`/api/users/${p.userID}`);
            const uData = await uRes.json();
            if (uRes.ok && uData.success) {
              return { ID: p.id, UserID: p.userID, Name: uData.data.firstName + (uData.data.lastName ? ' ' + uData.data.lastName : '') };
            }
          } catch(e) {}
          return { ID: p.id, UserID: p.userID, Name: `Patient #${p.id}` };
        }));
        setPatients(mappedPatients);
      }

      if (docData.success) {
        mappedDoctors = await Promise.all((docData.data || []).map(async d => {
          try {
            const uRes = await fetch(`/api/users/${d.userID}`);
            const uData = await uRes.json();
            if (uRes.ok && uData.success) {
              return { ID: d.id, UserID: d.userID, Name: uData.data.firstName + (uData.data.lastName ? ' ' + uData.data.lastName : '') };
            }
          } catch(e) {}
          return { ID: d.id, UserID: d.userID, Name: `Doctor #${d.id}` };
        }));
        setDoctors(mappedDoctors);
      }

      if (appData.success) {
        const apps = (appData.data || []).map(a => {
          const pName = mappedPatients.find(p => p.ID === a.patientID)?.Name || `Patient #${a.patientID}`;
          const dName = mappedDoctors.find(d => d.ID === a.doctorID)?.Name || `Doctor #${a.doctorID}`;
          return { ...a, PatientName: pName, DoctorName: dName };
        });
        setAppointments(apps);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
    setFormData({ PatientID: '', DoctorID: '', AppointmentDate: '', AppointmentTime: '', Status: 'Scheduled' });
  };

  const handleView = (a) => {
    setSelectedAppointment(a);
    const dateObj = new Date(a.appointmentDate);
    const dateStr = !isNaN(dateObj) ? dateObj.toISOString().split('T')[0] : '';
    setFormData({ 
      PatientID: a.patientID || '', 
      DoctorID: a.doctorID || '', 
      AppointmentDate: dateStr, 
      AppointmentTime: a.appointmentTime || '', 
      Status: a.status || 'Scheduled'
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedAppointment || !window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await fetch(`/api/appointments/${selectedAppointment.id}`, { method: 'DELETE' });
      closeModal();
      fetchData();
    } catch (err) {
      alert('Failed to delete appointment');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        patientID: parseInt(formData.PatientID),
        doctorID: parseInt(formData.DoctorID),
        appointmentDate: formData.AppointmentDate ? new Date(formData.AppointmentDate).toISOString() : new Date().toISOString(),
        appointmentTime: formData.AppointmentTime,
        status: formData.Status
      };

      let res;
      if (selectedAppointment) {
        res = await fetch(`/api/appointments/${selectedAppointment.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        closeModal();
        fetchData();
      } else alert("Failed to save appointment");
    } catch (err) {
      alert("Error saving appointment");
    }
  };

  let displayAppointments = appointments;
  if (storedUser.role === 'Doctor') {
    const myDoc = doctors.find(d => d.UserID === storedUser.id);
    if (myDoc) {
      displayAppointments = appointments.filter(a => a.doctorID === myDoc.ID);
    } else {
      displayAppointments = [];
    }
  } else if (storedUser.role === 'Patient') {
    const myPat = patients.find(p => p.UserID === storedUser.id);
    if (myPat) {
      displayAppointments = appointments.filter(a => a.patientID === myPat.ID);
    } else {
      displayAppointments = [];
    }
  }

  return (
    <section className="data-section">
      <div className="section-header">
        <h2>Schedule</h2>
        {!isPatient && (
          <button className="btn-primary" onClick={() => { closeModal(); setShowModal(true); }}>
            <Plus size={18} /> Book Appointment
          </button>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '1.5rem'}}>
              <h3 style={{margin:0}}>{selectedAppointment ? (isPatient ? 'Appointment Details' : 'Update Appointment') : 'Book Appointment'}</h3>
              <X size={24} style={{cursor:'pointer', color:'var(--text-muted)'}} onClick={closeModal} />
            </div>
            {selectedAppointment && isPatient ? (
              <div style={{ marginTop: '1rem', fontSize: '1.1rem', lineHeight: '1.8' }}>
                <p><strong>Patient:</strong> {patients.find(p => p.ID === parseInt(formData.PatientID))?.Name || 'Unknown'}</p>
                <p><strong>Doctor:</strong> {doctors.find(d => d.ID === parseInt(formData.DoctorID))?.Name || 'Unknown'}</p>
                <p><strong>Date:</strong> {formData.AppointmentDate}</p>
                <p><strong>Time:</strong> {formData.AppointmentTime}</p>
                <p><strong>Status:</strong> <span className="status-badge active">{formData.Status}</span></p>
                <div className="modal-actions" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn-secondary" onClick={closeModal}>Close</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Patient</label>
                  <select required value={formData.PatientID} onChange={e => setFormData({...formData, PatientID: e.target.value})}>
                    <option value="">Select Patient</option>
                    {patients.map(p => <option key={p.ID} value={p.ID}>{p.Name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Doctor</label>
                  <select required value={formData.DoctorID} onChange={e => setFormData({...formData, DoctorID: e.target.value})}>
                    <option value="">Select Doctor</option>
                    {doctors.map(d => <option key={d.ID} value={d.ID}>{d.Name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{display: 'flex', gap: '10px'}}>
                  <div style={{flex: 1}}>
                    <label>Date</label>
                    <input required type="date" value={formData.AppointmentDate} onChange={e => setFormData({...formData, AppointmentDate: e.target.value})} />
                  </div>
                  <div style={{flex: 1}}>
                    <label>Time</label>
                    <input required type="time" value={formData.AppointmentTime} onChange={e => setFormData({...formData, AppointmentTime: e.target.value})} />
                  </div>
                </div>
                {selectedAppointment && (
                  <div className="form-group">
                    <label>Status</label>
                    <select required value={formData.Status} onChange={e => setFormData({...formData, Status: e.target.value})}>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                )}
                <div className="modal-actions" style={{ display: 'flex', justifyContent: selectedAppointment ? 'space-between' : 'flex-end', alignItems: 'center' }}>
                  {selectedAppointment && (
                    <button type="button" onClick={handleDelete} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontFamily: 'Outfit', fontWeight: '500' }}>Delete</button>
                  )}
                  <div style={{display: 'flex', gap: '1rem'}}>
                    <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="btn-primary">{selectedAppointment ? 'Update Slot' : 'Book Slot'}</button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state"><div className="spinner"></div><p>Loading schedule...</p></div>
      ) : error ? (
        <div className="loading-state" style={{ color: 'var(--danger)' }}><Activity size={40} /><p>{error}</p></div>
      ) : appointments.length === 0 ? (
        <div className="loading-state"><Calendar size={40} /><p>No appointments scheduled.</p></div>
      ) : (
        <table className="glass-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayAppointments.map(a => {
              const dateStr = !isNaN(new Date(a.appointmentDate)) ? new Date(a.appointmentDate).toLocaleDateString() : '';
              const timeStr = a.appointmentTime || '';
              return (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.PatientName}</td>
                  <td>{a.DoctorName}</td>
                  <td>{`${dateStr} ${timeStr}`.trim()}</td>
                  <td><span className="status-badge active">{a.status || 'Scheduled'}</span></td>
                  <td><button onClick={() => handleView(a)} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '5px' }}>View</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
