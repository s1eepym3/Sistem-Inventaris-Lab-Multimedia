import React, { useState, useEffect } from 'react';
import api from '../api/api';

function DataBarang() {
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State untuk form modal
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama_barang: '',
    kategori: '',
    stok: 0,
    satuan: ''
  });

  useEffect(() => {
    fetchBarang();
  }, []);

  const fetchBarang = async () => {
    try {
      setLoading(true);
      const response = await api.get('/barang');
      setBarang(response.data);
      setError(null);
    } catch (err) {
      console.error("Gagal mengambil data barang:", err);
      setError("Gagal memuat data dari server. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'stok' ? parseInt(value) || 0 : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post('/barang', formData);
      
      // Reset form dan sembunyikan modal
      setFormData({ nama_barang: '', kategori: '', stok: 0, satuan: '' });
      setShowModal(false);
      
      // Refresh data di tabel
      fetchBarang();
    } catch (err) {
      console.error("Gagal menyimpan barang:", err);
      alert("Gagal menyimpan data barang. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content-area" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Data Master Barang</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Tambah Barang
        </button>
      </div>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          {error}
        </div>
      )}

      <div className="card">
        <div className="table-container">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Memuat data...</div>
          ) : barang.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada data barang. Silakan klik "Tambah Barang".</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Barang</th>
                  <th>Kategori</th>
                  <th>Stok</th>
                  <th>Satuan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {barang.map((item, index) => {
                  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                  const isAdmin = userInfo?.role === 'admin';
                  
                  return (
                    <tr key={item._id || index}>
                      <td>{index + 1}</td>
                      <td style={{ fontWeight: '500' }}>{item.nama_barang}</td>
                      <td>
                        <span style={{ padding: '0.2rem 0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary-color)', borderRadius: '1rem', fontSize: '0.75rem' }}>
                          {item.kategori}
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          fontWeight: 'bold', 
                          color: item.stok === 0 ? 'var(--danger)' : (item.stok < 5 ? 'var(--warning)' : 'inherit')
                        }}>
                          {item.stok}
                        </span>
                      </td>
                      <td>{item.satuan}</td>
                      <td>
                        {isAdmin ? (
                          <button 
                            className="btn btn-danger" 
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => {
                              if(window.confirm(`Hapus ${item.nama_barang}?`)) {
                                api.delete(`/barang/${item._id}`).then(() => fetchBarang());
                              }
                            }}
                          >
                            Hapus
                          </button>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>No Action</span>
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

      {/* Modal Tambah Barang */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card glass" style={{ width: '100%', maxWidth: '500px', padding: '2rem', animation: 'fadeIn 0.2s ease-out' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Tambah Barang Baru</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Nama Barang</label>
                <input 
                  type="text" 
                  name="nama_barang" 
                  value={formData.nama_barang} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Contoh: Papan Akrilik"
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Kategori</label>
                <input 
                  type="text" 
                  name="kategori" 
                  value={formData.kategori} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Contoh: Bahan Cetak"
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Stok Awal</label>
                  <input 
                    type="number" 
                    name="stok" 
                    value={formData.stok} 
                    onChange={handleInputChange} 
                    required 
                    min="0"
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Satuan</label>
                  <input 
                    type="text" 
                    name="satuan" 
                    value={formData.satuan} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Contoh: Pcs, Lembar, dll"
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  style={{ padding: '0.5rem 1rem', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Barang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataBarang;
