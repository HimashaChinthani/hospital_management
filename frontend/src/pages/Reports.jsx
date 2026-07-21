import React, { useState, useEffect } from 'react';
import { BarChart, TrendingUp, Users, FileText, Activity } from 'lucide-react';

export default function Reports() {
  const [data, setData] = useState({ revenue: 0, patients: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patRes, billRes] = await Promise.all([
          fetch('/api/patients'),
          fetch('/api/bills')
        ]);
        
        const patData = await patRes.json();
        const billData = await billRes.json();

        let totalRev = 0;
        if (billData.success && billData.data) {
          totalRev = billData.data.reduce((sum, bill) => sum + (bill.amount || 0), 0);
        }

        setData({
          patients: patData.success && patData.data ? patData.data.length : 0,
          revenue: totalRev
        });
      } catch (err) {
        console.error("Failed to load report data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-state"><div className="spinner"></div><p>Generating reports...</p></div>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <div className="value">RS {data.revenue.toLocaleString()}</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total Patients</h3>
            <div className="value">{data.patients}</div>
          </div>
          <div className="stat-icon" style={{ background: 'rgba(129, 140, 248, 0.1)', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
        </div>
      </section>

      <section className="data-section">
        <div className="section-header">
          <h2>Revenue Overview</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '250px', gap: '2rem', padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
          {/* Mock CSS Bar Chart */}
          <div style={{ flex: 1, background: 'var(--primary)', height: '40%', borderRadius: '8px 8px 0 0', position: 'relative' }}><span style={{position:'absolute', bottom: '-25px', left: '50%', transform:'translateX(-50%)', color:'var(--text-muted)'}}>Jan</span></div>
          <div style={{ flex: 1, background: 'var(--primary)', height: '60%', borderRadius: '8px 8px 0 0', position: 'relative' }}><span style={{position:'absolute', bottom: '-25px', left: '50%', transform:'translateX(-50%)', color:'var(--text-muted)'}}>Feb</span></div>
          <div style={{ flex: 1, background: 'var(--primary)', height: '80%', borderRadius: '8px 8px 0 0', position: 'relative' }}><span style={{position:'absolute', bottom: '-25px', left: '50%', transform:'translateX(-50%)', color:'var(--text-muted)'}}>Mar</span></div>
          <div style={{ flex: 1, background: 'var(--primary)', height: '50%', borderRadius: '8px 8px 0 0', position: 'relative' }}><span style={{position:'absolute', bottom: '-25px', left: '50%', transform:'translateX(-50%)', color:'var(--text-muted)'}}>Apr</span></div>
          <div style={{ flex: 1, background: 'var(--primary)', height: '90%', borderRadius: '8px 8px 0 0', position: 'relative' }}><span style={{position:'absolute', bottom: '-25px', left: '50%', transform:'translateX(-50%)', color:'var(--text-muted)'}}>May</span></div>
        </div>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary"><BarChart size={18} style={{marginRight:'8px'}}/> Export PDF</button>
          <button className="btn-secondary"><FileText size={18} style={{marginRight:'8px'}}/> Export Excel</button>
        </div>
      </section>
    </div>
  );
}
