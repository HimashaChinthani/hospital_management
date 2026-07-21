import React, { useState, useEffect } from 'react';
import { Activity, Plus, FileText, X } from 'lucide-react';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem('medicore_user') || '{}');
  const isPatient = storedUser.role === 'Patient';
  
  const [formData, setFormData] = useState({ PatientID: '', DoctorID: '', AppointmentID: '', DoctorNotes: '' });
  const [selectedItems, setSelectedItems] = useState([]);
  const [newItem, setNewItem] = useState({ MedicineID: '', Dosage: '', Duration: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [preRes, appRes, medRes, patRes, docRes, itemRes] = await Promise.all([
        fetch('/api/prescriptions'),
        fetch('/api/appointments'),
        fetch('/api/medicines'),
        fetch('/api/patients'),
        fetch('/api/doctors'),
        fetch('/api/prescriptionitems')
      ]);

      const preData = await preRes.json();
      const appData = await appRes.json();
      const medData = await medRes.json();
      const patData = await patRes.json();
      const docData = await docRes.json();
      const itemData = await itemRes.json();

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

      setAppointments(appData.success ? appData.data || [] : []);
      setMedicines(medData.success ? medData.data || [] : []);
      
      if (preData.success) {
        const prescs = (preData.data || []).map(p => {
          const app = (appData.data || []).find(a => a.id === p.appointmentID);
          let pName = 'Unknown', dName = 'Unknown';
          if (app) {
             pName = mappedPatients.find(pat => pat.ID === app.patientID)?.Name || `Patient #${app.patientID}`;
             dName = mappedDoctors.find(doc => doc.ID === app.doctorID)?.Name || `Doctor #${app.doctorID}`;
          }
          const items = (itemData.data || []).filter(i => i.prescriptionID === p.id).map(i => {
             const m = (medData.data || []).find(med => med.id === i.medicineID);
             return { ...i, MedicineName: m ? m.medicineName : `Item #${i.medicineID}` };
          });
          return { ...p, PatientName: pName, DoctorName: dName, Items: items, DoctorID: app?.doctorID, PatientID: app?.patientID };
        });
        setPrescriptions(prescs);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (formData.PatientID && formData.DoctorID) {
      const match = appointments.find(a => a.patientID === parseInt(formData.PatientID) && a.doctorID === parseInt(formData.DoctorID));
      if (match) setFormData(prev => ({ ...prev, AppointmentID: match.id }));
      else setFormData(prev => ({ ...prev, AppointmentID: '' }));
    }
  }, [formData.PatientID, formData.DoctorID, appointments]);

  const closeModal = () => {
    setShowModal(false);
    setSelectedPrescription(null);
    setFormData({ PatientID: '', DoctorID: '', AppointmentID: '', DoctorNotes: '' });
    setSelectedItems([]);
    setNewItem({ MedicineID: '', Dosage: '', Duration: '' });
  };

  const handleView = (p) => {
    setSelectedPrescription(p);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedPrescription || !window.confirm('Delete prescription?')) return;
    try {
      await fetch(`/api/prescriptions/${selectedPrescription.id}`, { method: 'DELETE' });
      closeModal();
      fetchData();
    } catch(err) { alert('Failed to delete'); }
  };

  const addItem = () => {
    if (newItem.MedicineID && newItem.Dosage && newItem.Duration) {
      const med = medicines.find(m => m.id === parseInt(newItem.MedicineID));
      setSelectedItems([...selectedItems, { ...newItem, MedicineName: med?.medicineName }]);
      setNewItem({ MedicineID: '', Dosage: '', Duration: '' });
    }
  };

  const removeItem = (idx) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.AppointmentID) {
      alert("No appointment found for this Patient and Doctor combination.");
      return;
    }
    
    try {
      const res = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentID: parseInt(formData.AppointmentID), doctorNotes: formData.DoctorNotes })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        const pId = data.data.id;
        for (const item of selectedItems) {
          await fetch('/api/prescriptionitems', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prescriptionID: pId, medicineID: parseInt(item.MedicineID), dosage: item.Dosage, duration: item.Duration })
          });
        }
        closeModal();
        fetchData();
      } else {
        alert("Failed to create prescription");
      }
    } catch (err) {
      alert("Error creating prescription");
    }
  };

  let displayPrescriptions = prescriptions;
  if (storedUser.role === 'Doctor') {
    const myDoc = doctors.find(d => d.UserID === storedUser.id);
    if (myDoc) {
      displayPrescriptions = prescriptions.filter(p => p.DoctorID === myDoc.ID);
    } else {
      displayPrescriptions = [];
    }
  } else if (storedUser.role === 'Patient') {
    const myPat = patients.find(p => p.UserID === storedUser.id);
    if (myPat) {
      displayPrescriptions = prescriptions.filter(p => p.PatientID === myPat.ID);
    } else {
      displayPrescriptions = [];
    }
  }

  return (
    <section className="data-section">
      <div className="section-header">
        <h2>Prescription Records</h2>
        {!isPatient && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Create Prescription
          </button>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '1.5rem'}}>
              <h3 style={{margin:0}}>{selectedPrescription ? 'View Prescription' : 'New Prescription'}</h3>
              <X size={24} style={{cursor:'pointer', color:'var(--text-muted)'}} onClick={closeModal} />
            </div>
            
            {selectedPrescription ? (
              <div>
                <p><strong>Patient:</strong> {selectedPrescription.PatientName}</p>
                <p><strong>Doctor:</strong> {selectedPrescription.DoctorName}</p>
                <p><strong>Notes:</strong> {selectedPrescription.doctorNotes}</p>
                <h4 style={{marginTop: '1rem', marginBottom: '0.5rem', fontSize: '1rem'}}>Prescribed Medicines:</h4>
                <ul style={{marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', listStyleType: 'none'}}>
                  {selectedPrescription.Items.map((item, idx) => {
                    const dosageStr = !isNaN(item.dosage) && item.dosage.trim() !== '' ? `${item.dosage} tabs` : item.dosage;
                    const durationStr = !isNaN(item.duration) && item.duration.trim() !== '' ? `${item.duration} days` : item.duration;
                    return (
                      <li key={idx} style={{marginBottom:'5px'}}>{item.MedicineName} - {dosageStr} for {durationStr}</li>
                    )
                  })}
                  {selectedPrescription.Items.length === 0 && <li>No medicines prescribed.</li>}
                </ul>
                <div className="modal-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button type="button" onClick={handleDelete} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontFamily: 'Outfit', fontWeight: '500' }}>Delete</button>
                  <button type="button" className="btn-secondary" onClick={closeModal}>Close</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{display: 'flex', gap: '10px'}}>
                  <div style={{flex: 1}}>
                    <label>Patient</label>
                    <select required value={formData.PatientID} onChange={e => setFormData({...formData, PatientID: e.target.value})}>
                      <option value="">Select Patient</option>
                      {patients.map(p => <option key={p.ID} value={p.ID}>{p.Name}</option>)}
                    </select>
                  </div>
                  <div style={{flex: 1}}>
                    <label>Doctor</label>
                    <select required value={formData.DoctorID} onChange={e => setFormData({...formData, DoctorID: e.target.value})}>
                      <option value="">Select Doctor</option>
                      {doctors.map(d => <option key={d.ID} value={d.ID}>{d.Name}</option>)}
                    </select>
                  </div>
                </div>
                {!formData.AppointmentID && formData.PatientID && formData.DoctorID && (
                  <p style={{color: 'var(--danger)', fontSize: '0.85rem', marginTop: '-10px', marginBottom: '10px'}}>No appointment found for this patient and doctor!</p>
                )}
                <div className="form-group">
                  <label>Doctor Notes</label>
                  <input required type="text" value={formData.DoctorNotes} onChange={e => setFormData({...formData, DoctorNotes: e.target.value})} placeholder="Take rest and follow up in a week" />
                </div>
                
                <h4 style={{marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '1rem'}}>Add Pharmacy Items</h4>
                <div className="form-group" style={{display: 'flex', gap: '10px', alignItems: 'flex-end'}}>
                  <div style={{flex: 2}}>
                    <label style={{fontSize: '0.8rem'}}>Medicine</label>
                    <select value={newItem.MedicineID} onChange={e => setNewItem({...newItem, MedicineID: e.target.value})}>
                      <option value="">Select...</option>
                      {medicines.map(m => <option key={m.id} value={m.id}>{m.medicineName}</option>)}
                    </select>
                  </div>
                  <div style={{flex: 1}}>
                    <label style={{fontSize: '0.8rem'}}>Dosage</label>
                    <input type="text" value={newItem.Dosage} onChange={e => setNewItem({...newItem, Dosage: e.target.value})} placeholder="1 tab" />
                  </div>
                  <div style={{flex: 1}}>
                    <label style={{fontSize: '0.8rem'}}>Duration</label>
                    <input type="text" value={newItem.Duration} onChange={e => setNewItem({...newItem, Duration: e.target.value})} placeholder="3 days" />
                  </div>
                  <button type="button" onClick={addItem} className="btn-secondary" style={{padding: '10px 15px'}}>Add</button>
                </div>
                
                {selectedItems.length > 0 && (
                  <ul style={{marginBottom: '1rem', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', listStyleType: 'none'}}>
                    {selectedItems.map((item, idx) => (
                      <li key={idx} style={{display:'flex', justifyContent:'space-between', marginBottom:'5px', fontSize:'0.9rem'}}>
                        <span>{item.MedicineName} - {item.Dosage} for {item.Duration}</span>
                        <X size={16} onClick={() => removeItem(idx)} style={{cursor: 'pointer', color: 'var(--danger)'}} />
                      </li>
                    ))}
                  </ul>
                )}

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={!formData.AppointmentID}>Save Prescription</button>
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
      ) : prescriptions.length === 0 ? (
        <div className="loading-state"><FileText size={40} /><p>No prescriptions found.</p></div>
      ) : (
        <table className="glass-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Notes</th>
              <th>Medicines</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayPrescriptions.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.PatientName}</td>
                <td>{p.DoctorName}</td>
                <td>{p.doctorNotes}</td>
                <td>{p.Items.length} items</td>
                <td><button onClick={() => handleView(p)} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '5px' }}>View Details</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
