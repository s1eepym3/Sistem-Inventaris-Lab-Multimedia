import React, { useState, useEffect } from 'react';
import api from '../api/api';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/auth/users/${id}/approve`);
      fetchUsers();
    } catch (err) {
      alert("Gagal menyetujui user");
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Hapus/Tolak user ${name}?`)) {
      try {
        await api.delete(`/auth/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert("Gagal menghapus user");
      }
    }
  };

  return (
    <div className="content-area">
      <h1>Kelola User & Persetujuan</h1>
      <p style={{ color: 'var(--text-muted)' }}>Setujui pendaftaran user baru agar mereka bisa login.</p>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="table-container">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Memuat data user...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>{u.nama}</td>
                    <td>{u.email}</td>
                    <td>
                      <span style={{ 
                        textTransform: 'capitalize', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '1rem', 
                        fontSize: '0.75rem',
                        background: u.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: u.role === 'admin' ? 'var(--danger)' : 'var(--primary-color)'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      {u.isApproved ? (
                        <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>Disetujui</span>
                      ) : (
                        <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>Menunggu</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {!u.isApproved && (
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => handleApprove(u._id)}
                          >
                            Setujui
                          </button>
                        )}
                        {u.role !== 'admin' && (
                          <button 
                            className="btn btn-danger" 
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => handleDelete(u._id, u.nama)}
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
