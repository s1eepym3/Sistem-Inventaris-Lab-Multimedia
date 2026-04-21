import React, { useState, useEffect } from 'react';
import api from '../api/api';

function Dashboard() {
  const [totalBarang, setTotalBarang] = useState(0);

  useEffect(() => {
    // Ambil data barang untuk mendapatkan total
    api.get('/barang')
      .then(response => {
        setTotalBarang(response.data.length);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Dashboard Overview</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card glass">
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Macam Barang</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
            {totalBarang}
          </p>
        </div>
        <div className="card glass">
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Status Sistem</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--success)', marginTop: '0.5rem' }}>
            ● Online
          </p>
        </div>
      </div>
      
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Selamat Datang!</h3>
        <p style={{ color: 'var(--text-muted)' }}>
          Ini adalah versi awal dari Sistem Inventaris Lab Multimedia. Gunakan menu di sebelah kiri untuk menavigasi ke halaman Data Barang.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
