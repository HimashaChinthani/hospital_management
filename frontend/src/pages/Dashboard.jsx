import React, { useState, useEffect } from 'react';
import { Users, Calendar, Receipt, Pill, Activity } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    medicines: 0,
    bills: 0,
    demo: { adultPct: 65, seniorPct: 25, childPct: 10 },
    charts: { Mon: '40%', Tue: '65%', Wed: '80%', Thu: '50%', Fri: '90%', Sat: '30%' }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patRes, appRes, medRes, billRes] = await Promise.all([
          fetch('/api/patients'),
          fetch('/api/appointments'),
          fetch('/api/medicines'),
          fetch('/api/bills')
        ]);
        
        const patData = await patRes.json();
        const appData = await appRes.json();
        const medData = await medRes.json();
        const billData = await billRes.json();

        const patList = patData.success && patData.data ? patData.data : [];
        const appList = appData.success && appData.data ? appData.data : [];
        const medList = medData.success && medData.data ? medData.data : [];
        const billList = billData.success && billData.data ? billData.data : [];

        // Compute Demographics
        let adults = 0, seniors = 0, children = 0;
        const currentYear = new Date().getFullYear();
        patList.forEach(p => {
          if (p.dob) {
            const age = currentYear - new Date(p.dob).getFullYear();
            if (age < 18) children++;
            else if (age >= 60) seniors++;
            else adults++;
          } else {
            adults++; // default if no dob
          }
        });
        const totalAges = adults + seniors + children || 1;
        const adultPct = Math.round((adults / totalAges) * 100);
        const seniorPct = Math.round((seniors / totalAges) * 100);
        const childPct = Math.round((children / totalAges) * 100);

        // Compute Appointments by Day
        const weekDays = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0 };
        appList.forEach(a => {
          if (a.appointmentDate) {
            const dayStr = new Date(a.appointmentDate).toLocaleString('en-US', { weekday: 'short' });
            if (weekDays[dayStr] !== undefined) weekDays[dayStr]++;
          }
        });
        const maxAppts = Math.max(...Object.values(weekDays), 1);
        const getApptPct = (day) => Math.round((weekDays[day] / maxAppts) * 100) + '%';

        setStats({
          patients: patList.length,
          appointments: appList.length,
          medicines: medList.length,
          bills: billList.length,
          demo: { adultPct, seniorPct, childPct },
          charts: {
            Mon: getApptPct('Mon'),
            Tue: getApptPct('Tue'),
            Wed: getApptPct('Wed'),
            Thu: getApptPct('Thu'),
            Fri: getApptPct('Fri'),
            Sat: getApptPct('Sat')
          }
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <section>
      <div className="section-header" style={{ marginBottom: '2rem' }}>
        <h2>Dashboard Overview</h2>
        <p style={{color: 'var(--text-muted)'}}>Welcome back to MediCore Hospital Management System</p>
      </div>

      {loading ? (
        <div className="loading-state"><div className="spinner"></div><p>Loading stats...</p></div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <h3>Total Patients</h3>
              <div className="value">{stats.patients}</div>
            </div>
            <div className="stat-icon">
              <Users size={24} />
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-info">
              <h3>Appointments</h3>
              <div className="value">{stats.appointments}</div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <Calendar size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <h3>Medicines in Stock</h3>
              <div className="value">{stats.medicines}</div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
              <Pill size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <h3>Total Invoices</h3>
              <div className="value">{stats.bills}</div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <Receipt size={24} />
            </div>
          </div>
        </div>
      )}
      
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ padding: '2rem', background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Weekly Appointments</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '5px' }}>
              <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.8)', height: stats.charts.Mon, borderRadius: '4px 4px 0 0', position: 'relative', transition: 'height 1s ease-out' }}><span style={{position:'absolute', bottom: '-25px', left: '50%', transform:'translateX(-50%)', color:'var(--text-muted)', fontSize: '0.8rem'}}>Mon</span></div>
              <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.8)', height: stats.charts.Tue, borderRadius: '4px 4px 0 0', position: 'relative', transition: 'height 1s ease-out' }}><span style={{position:'absolute', bottom: '-25px', left: '50%', transform:'translateX(-50%)', color:'var(--text-muted)', fontSize: '0.8rem'}}>Tue</span></div>
              <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.8)', height: stats.charts.Wed, borderRadius: '4px 4px 0 0', position: 'relative', transition: 'height 1s ease-out' }}><span style={{position:'absolute', bottom: '-25px', left: '50%', transform:'translateX(-50%)', color:'var(--text-muted)', fontSize: '0.8rem'}}>Wed</span></div>
              <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.8)', height: stats.charts.Thu, borderRadius: '4px 4px 0 0', position: 'relative', transition: 'height 1s ease-out' }}><span style={{position:'absolute', bottom: '-25px', left: '50%', transform:'translateX(-50%)', color:'var(--text-muted)', fontSize: '0.8rem'}}>Thu</span></div>
              <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.8)', height: stats.charts.Fri, borderRadius: '4px 4px 0 0', position: 'relative', transition: 'height 1s ease-out' }}><span style={{position:'absolute', bottom: '-25px', left: '50%', transform:'translateX(-50%)', color:'var(--text-muted)', fontSize: '0.8rem'}}>Fri</span></div>
              <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.8)', height: stats.charts.Sat, borderRadius: '4px 4px 0 0', position: 'relative', transition: 'height 1s ease-out' }}><span style={{position:'absolute', bottom: '-25px', left: '50%', transform:'translateX(-50%)', color:'var(--text-muted)', fontSize: '0.8rem'}}>Sat</span></div>
            </div>
          </div>

          <div style={{ padding: '2rem', background: 'var(--glass-bg)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Patient Demographics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}><span>Adults (18-60)</span><span style={{fontWeight: 'bold'}}>{stats.demo.adultPct}%</span></div>
                <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}><div style={{ width: `${stats.demo.adultPct}%`, background: 'var(--primary)', height: '100%', borderRadius: '6px', transition: 'width 1s ease-out' }}></div></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}><span>Seniors (60+)</span><span style={{fontWeight: 'bold'}}>{stats.demo.seniorPct}%</span></div>
                <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}><div style={{ width: `${stats.demo.seniorPct}%`, background: '#f59e0b', height: '100%', borderRadius: '6px', transition: 'width 1s ease-out' }}></div></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}><span>Children (0-18)</span><span style={{fontWeight: 'bold'}}>{stats.demo.childPct}%</span></div>
                <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}><div style={{ width: `${stats.demo.childPct}%`, background: '#8b5cf6', height: '100%', borderRadius: '6px', transition: 'width 1s ease-out' }}></div></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
