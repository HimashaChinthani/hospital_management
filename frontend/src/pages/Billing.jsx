import React, { useState, useEffect } from 'react';
import { Activity, Plus, Receipt, X } from 'lucide-react';

export default function Billing() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [printBill, setPrintBill] = useState(null);
  const [formData, setFormData] = useState({ AppointmentID: '', Amount: '', PaymentStatus: 'Unpaid' });

  const handlePrint = (bill) => {
    setPrintBill(bill);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const fetchData = async () => {
    try {
      const response = await fetch('/api/bills');
      if (!response.ok) throw new Error('Failed to fetch bills.');
      const data = await response.json();
      setBills(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentID: parseInt(formData.AppointmentID), 
          amount: parseFloat(formData.Amount), 
          paymentStatus: formData.PaymentStatus
        })
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ AppointmentID: '', Amount: '', PaymentStatus: 'Unpaid' });
        fetchData();
      } else {
        alert("Failed to create bill");
      }
    } catch (err) {
      alert("Error creating bill");
    }
  };

  return (
    <section className="data-section">
      <div className="section-header">
        <h2>Invoices</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Create Bill
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '1.5rem'}}>
              <h3 style={{margin:0}}>Generate Invoice</h3>
              <X size={24} style={{cursor:'pointer', color:'var(--text-muted)'}} onClick={() => setShowModal(false)} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Appointment ID</label>
                <input required type="number" value={formData.AppointmentID} onChange={e => setFormData({...formData, AppointmentID: e.target.value})} placeholder="e.g. 1" />
              </div>
              <div className="form-group">
                <label>Total Amount (RS)</label>
                <input required type="number" step="0.01" value={formData.Amount} onChange={e => setFormData({...formData, Amount: e.target.value})} placeholder="150.00" />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={formData.PaymentStatus} onChange={e => setFormData({...formData, PaymentStatus: e.target.value})}>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Generate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state"><div className="spinner"></div><p>Loading invoices...</p></div>
      ) : error ? (
        <div className="loading-state" style={{ color: 'var(--danger)' }}><Activity size={40} /><p>{error}</p></div>
      ) : bills.length === 0 ? (
        <div className="loading-state"><Receipt size={40} /><p>No bills found.</p></div>
      ) : (
        <table className="glass-table">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Appointment ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(b => (
              <tr key={b.id}>
                <td>#{b.id}</td>
                <td>{b.appointmentID}</td>
                <td>RS {b.amount}</td>
                <td>
                  <span className={`status-badge ${b.paymentStatus === 'Paid' ? 'active' : 'inactive'}`}>
                    {b.paymentStatus}
                  </span>
                </td>
                <td><button onClick={() => handlePrint(b)} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>Print</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {printBill && (
        <div className="print-area" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'white', color: 'black', zIndex: 9999, padding: '40px' }}>
          <h1 style={{color: 'black', borderBottom: '2px solid black', paddingBottom: '10px'}}>Medicore Hospital</h1>
          <h2 style={{marginTop: '20px'}}>Invoice #{printBill.id}</h2>
          <div style={{marginTop: '20px', fontSize: '1.2rem'}}>
            <p><strong>Appointment ID:</strong> {printBill.appointmentID}</p>
            <p><strong>Total Amount:</strong> RS {printBill.amount}</p>
            <p><strong>Status:</strong> {printBill.paymentStatus}</p>
          </div>
          <hr style={{margin: '30px 0', border: '1px solid #ccc'}} />
          <p style={{fontStyle: 'italic', color: '#555'}}>Thank you for choosing Medicore.</p>
          <div className="no-print" style={{marginTop: '40px'}}>
             <button onClick={() => setPrintBill(null)} className="btn-secondary" style={{color: 'black', border: '1px solid black', padding: '10px 20px', cursor: 'pointer'}}>Close Print View</button>
             <button onClick={() => window.print()} className="btn-primary" style={{marginLeft: '10px', padding: '10px 20px', cursor: 'pointer', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px'}}>Print Again</button>
          </div>
        </div>
      )}
    </section>
  );
}
