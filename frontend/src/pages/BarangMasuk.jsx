import React, { useState, useEffect } from 'react';
import api from '../api/api';

function BarangMasuk() {
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
      // Fetch riwayat transaksi dan data master barang secara bersamaan
      const [transaksiRes, barangRes] = await Promise.all([
        api.get('/transaksi/masuk'),
        api.get('/barang')
      ]);
      setTransaksi(transaksiRes.data);
      setBarangList(barangRes.data);
      
      // Set default selected barang id jika data tersedia
      if (barangRes.data.length > 0 && !formData.barangId) {
        setFormData(prev => ({ ...prev, barangId: barangRes.data[0]._id }));
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
    try {
      setIsSubmitting(true);
      await api.post('/transaksi/masuk', formData);
      
      // Reset form (kecuali barangId untuk kemudahan)
      setFormData(prev => ({ ...prev, jumlah: 1, keterangan: '' }));
      setShowModal(false);
      
      fetchData(); // Refresh data
    } catch (err) {
      alert("Gagal menyimpan transaksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Barang Masuk</h1>
          <p style={{ color: 'var(--text-muted)' }}>Pencatatan penambahan stok barang</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Catat Barang Masuk
        </button>
      </div>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

      <div className="card">
        <div className="table-container">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Memuat riwayat transaksi...</div>
          ) : transaksi.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Belum ada riwayat barang masuk.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Nama Barang</th>
                  <th>Jumlah Masuk</th>
                  <th>Keterangan</th>
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
                        <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>+{trx.jumlah}</span>
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
                              if(window.confirm('Hapus riwayat ini? Stok barang akan dikurangi kembali.')) {
                                api.delete(`/transaksi/masuk/${trx._id}`).then(() => fetchData());
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

      {/* Modal Tambah Barang Masuk */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card glass" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2>Catat Barang Masuk</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Pilih Barang</label>
                <select name="barangId" value={formData.barangId} onChange={handleInputChange} required>
                  {barangList.map(b => (
                    <option key={b._id} value={b._id}>{b.nama_barang} (Stok: {b.stok})</option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Jumlah Masuk</label>
                <input type="number" name="jumlah" value={formData.jumlah} onChange={handleInputChange} required min="1" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>Keterangan</label>
                <input type="text" name="keterangan" value={formData.keterangan} onChange={handleInputChange} placeholder="Cth: Suplai bulanan" />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn">Batal</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BarangMasuk;
