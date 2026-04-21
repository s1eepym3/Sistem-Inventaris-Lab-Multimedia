import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div style={{ padding: '1.5rem', fontWeight: 'bold', fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', color: 'var(--primary-color)' }}>
        Lab Multimedia
      </div>
      <nav style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          style={({ isActive }) => ({
            padding: '0.75rem 1rem', 
            borderRadius: '0.5rem', 
            backgroundColor: isActive ? 'var(--primary-color)' : 'transparent', 
            color: isActive ? 'white' : 'var(--text-muted)',
            fontWeight: isActive ? '500' : 'normal',
            transition: 'all 0.2s'
          })}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/barang" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          style={({ isActive }) => ({
            padding: '0.75rem 1rem', 
            borderRadius: '0.5rem', 
            backgroundColor: isActive ? 'var(--primary-color)' : 'transparent', 
            color: isActive ? 'white' : 'var(--text-muted)',
            fontWeight: isActive ? '500' : 'normal',
            transition: 'all 0.2s'
          })}
        >
          Data Barang
        </NavLink>
        <NavLink 
          to="/masuk" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          style={({ isActive }) => ({
            padding: '0.75rem 1rem', 
            borderRadius: '0.5rem', 
            backgroundColor: isActive ? 'var(--primary-color)' : 'transparent', 
            color: isActive ? 'white' : 'var(--text-muted)',
            fontWeight: isActive ? '500' : 'normal',
            transition: 'all 0.2s'
          })}
        >
          Barang Masuk
        </NavLink>
        <NavLink 
          to="/keluar" 
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          style={({ isActive }) => ({
            padding: '0.75rem 1rem', 
            borderRadius: '0.5rem', 
            backgroundColor: isActive ? 'var(--primary-color)' : 'transparent', 
            color: isActive ? 'white' : 'var(--text-muted)',
            fontWeight: isActive ? '500' : 'normal',
            transition: 'all 0.2s'
          })}
        >
          Barang Keluar
        </NavLink>

        {JSON.parse(localStorage.getItem('userInfo'))?.role === 'admin' && (
          <NavLink 
            to="/users" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            style={({ isActive }) => ({
              padding: '0.75rem 1rem', 
              borderRadius: '0.5rem', 
              backgroundColor: isActive ? 'var(--primary-color)' : 'transparent', 
              color: isActive ? 'white' : 'var(--text-muted)',
              fontWeight: isActive ? '500' : 'normal',
              transition: 'all 0.2s',
              marginTop: '1rem',
              borderTop: '1px solid var(--border-color)'
            })}
          >
            Kelola User
          </NavLink>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
