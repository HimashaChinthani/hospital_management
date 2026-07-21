import React, { useState, useEffect } from 'react';
import { Activity, Plus, Pill, X } from 'lucide-react';

export default function Pharmacy() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [formData, setFormData] = useState({ Name: '', Stock: '', Price: '' });

  const fetchData = async () => {
    try {
      const response = await fetch('/api/medicines');
      if (!response.ok) throw new Error('Failed to fetch medicines.');
      const data = await response.json();
      setMedicines(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const closeModal = () => {
    setShowModal(false);
    setSelectedMedicine(null);
    setFormData({ Name: '', Stock: '', Price: '' });
  };

  const handleView = (m) => {
    setSelectedMedicine(m);
    setFormData({ Name: m.medicineName || '', Stock: m.stockQuantity || 0, Price: m.unitPrice || 0 });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedMedicine || !window.confirm('Are you sure you want to delete this medicine?')) return;
    try {
      await fetch(`/api/medicines/${selectedMedicine.id}`, { method: 'DELETE' });
      closeModal();
      fetchData();
    } catch (err) {
      alert('Failed to delete medicine');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        medicineName: formData.Name,
        stockQuantity: parseInt(formData.Stock),
        unitPrice: parseFloat(formData.Price)
      };

      let res;
      if (selectedMedicine) {
        res = await fetch(`/api/medicines/${selectedMedicine.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/medicines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        closeModal();
        fetchData();
      } else {
        alert("Failed to save medicine");
      }
    } catch (err) {
      alert("Error saving medicine");
    }
  };

  return (
    <section className="data-section">
      <div className="section-header">
        <h2>Inventory List</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Medicine
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '1.5rem'}}>
              <h3 style={{margin:0}}>{selectedMedicine ? 'Update Inventory' : 'Add Inventory'}</h3>
              <X size={24} style={{cursor:'pointer', color:'var(--text-muted)'}} onClick={closeModal} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Medicine Name</label>
                <input required type="text" value={formData.Name} onChange={e => setFormData({...formData, Name: e.target.value})} placeholder="Paracetamol" />
              </div>
              <div className="form-group">
                <label>Stock Quantity</label>
                <input required type="number" value={formData.Stock} onChange={e => setFormData({...formData, Stock: e.target.value})} placeholder="100" />
              </div>
              <div className="form-group">
                <label>Price (RS)</label>
                <input required type="number" step="0.01" value={formData.Price} onChange={e => setFormData({...formData, Price: e.target.value})} placeholder="5.99" />
              </div>
              <div className="modal-actions" style={{ display: 'flex', justifyContent: selectedMedicine ? 'space-between' : 'flex-end', alignItems: 'center' }}>
                {selectedMedicine && (
                  <button type="button" onClick={handleDelete} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontFamily: 'Outfit', fontWeight: '500' }}>Delete</button>
                )}
                <div style={{display: 'flex', gap: '1rem'}}>
                  <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn-primary">{selectedMedicine ? 'Update Item' : 'Save Item'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state"><div className="spinner"></div><p>Loading inventory...</p></div>
      ) : error ? (
        <div className="loading-state" style={{ color: 'var(--danger)' }}><Activity size={40} /><p>{error}</p></div>
      ) : medicines.length === 0 ? (
        <div className="loading-state"><Pill size={40} /><p>No medicines in inventory.</p></div>
      ) : (
        <table className="glass-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map(m => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.medicineName}</td>
                <td>{m.stockQuantity || 0} units</td>
                <td>RS {m.unitPrice}</td>
                <td><button onClick={() => handleView(m)} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '5px' }}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
