import React, { useState, useEffect } from 'react';
import api from '../api/api';

function BarangKeluar() {
  const [transaksi, setTransaksi] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    barangId: '',
    jumlah: 1,
    keterangan: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transaksiRes, barangRes] = await Promise.all([
        api.get('/transaksi/keluar'),
        api.get('/barang')
      ]);
      setTransaksi(transaksiRes.data);
      
      // Filter hanya barang yang punya stok > 0
      const availableBarang = barangRes.data.filter(b => b.stok > 0);
      setBarangList(availableBarang);
      
      if (availableBarang.length > 0 && !formData.barangId) {
        setFormData(prev => ({ ...prev, barangId: availableBarang[0]._id }));
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'jumlah' ? parseInt(value) || 0 : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi stok di frontend
    const selectedBarang = barangList.find(b => b._id === formData.barangId);
    if (selectedBarang && formData.jumlah > selectedBarang.stok) {
      alert(`Stok tidak mencukupi! Stok ${selectedBarang.nama_barang} hanya tersisa ${selectedBarang.stok}.`);
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/transaksi/keluar', formData);
      
      setFormData(prev => ({ ...prev, jumlah: 1, keterangan: '' }));
      setShowModal(false);
      
      fetchData(); 
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Gagal memproses transaksi. Pastikan stok mencukupi.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Barang Keluar</h1>
          <p style={{ color: 'var(--text-muted)' }}>Pencatatan distribusi / peminjaman barang</p>
        </div>
        <button className="btn btn-primary" style={{ backgroundColor: 'var(--warning)', color: '#000' }} onClick={() => setShowModal(true)}>
          - Catat Barang Keluar
        </button>
      </div>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

      <div className="card">
        <div className="table-container">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Memuat riwayat transaksi...</div>
          ) : transaksi.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Belum ada riwayat barang keluar.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Nama Barang</th>
                  <th>Jumlah Keluar</th>
                  <th>Keterangan (Peminjam)</th>
                  <th>Operator</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transaksi.map((trx, idx) => {
                  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                  const isAdmin = userInfo?.role === 'admin';

                  return (
                    <tr key={trx._id || idx}>
                      <td>{new Date(trx.tanggal || trx.createdAt).toLocaleDateString('id-ID')}</td>
                      <td style={{ fontWeight: '500' }}>
                        {trx.barang ? trx.barang.nama_barang : 'Barang Dihapus'}
                      </td>
                      <td>
                        <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>-{trx.jumlah}</span>
                      </td>
                      <td>{trx.keterangan || '-'}</td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {trx.user ? trx.user.nama : 'Unknown'}
                        </span>
                      </td>
                      <td>
                        {isAdmin && (
                          <button 
                            className="btn btn-danger" 
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => {
                              if(window.confirm('Hapus riwayat ini? Stok barang akan ditambahkan kembali.')) {
                                api.delete(`/transaksi/keluar/${trx._id}`).then(() => fetchData());
                              }
                            }}
                          >
                            Hapus
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card glass" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2>Catat Barang Keluar</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Pilih Barang (Hanya yang ada stok)</label>
                {barangList.length === 0 ? (
                  <select disabled><option>Semua stok kosong</option></select>
                ) : (
                  <select name="barangId" value={formData.barangId} onChange={handleInputChange} required>
                    {barangList.map(b => (
                      <option key={b._id} value={b._id}>{b.nama_barang} (Tersisa: {b.stok})</option>
                    ))}
                  </select>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Jumlah Keluar</label>
                <input type="number" name="jumlah" value={formData.jumlah} onChange={handleInputChange} required min="1" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Keterangan / Penerima</label>
                <input type="text" name="keterangan" value={formData.keterangan} onChange={handleInputChange} required placeholder="Cth: Dipinjam oleh Fakultas Teknik" />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn">Batal</button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--warning)', color: '#000' }} disabled={isSubmitting || barangList.length === 0}>
                  {isSubmitting ? 'Memproses...' : 'Simpan Transaksi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BarangKeluar;
