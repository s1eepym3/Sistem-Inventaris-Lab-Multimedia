import React from 'react';
import { useNavigate } from 'react-router-dom';

function Topbar({ userInfo, setUserInfo }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    navigate('/login');
  };

  return (
    <header className="topbar glass">
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '500' }}>Sistem Inventaris Lab</h2>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <span style={{ color: 'var(--text-main)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
            {userInfo?.nama ? userInfo.nama.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: '600', lineHeight: '1.2' }}>{userInfo?.nama || 'User'}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {userInfo?.role === 'admin' ? 'Administrator' : 'Member'}
            </span>
          </div>
        </span>
        
        <button 
          onClick={handleLogout}
          className="btn" 
          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', backgroundColor: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;
