import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import DataBarang from './pages/DataBarang';
import BarangMasuk from './pages/BarangMasuk';
import BarangKeluar from './pages/BarangKeluar';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';

function App() {
  const [userInfo, setUserInfo] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Komponen pembungkus untuk halaman yang butuh login
  const ProtectedLayout = () => {
    if (!userInfo) {
      return <Navigate to="/login" replace />;
    }
    return (
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Topbar userInfo={userInfo} setUserInfo={setUserInfo} />
          <Outlet />
        </main>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        {/* Rute Publik */}
        <Route path="/login" element={<Login setUserInfo={setUserInfo} />} />
        
        {/* Rute yang Dilindungi */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/barang" element={<DataBarang />} />
          <Route path="/masuk" element={<BarangMasuk />} />
          <Route path="/keluar" element={<BarangKeluar />} />
          <Route path="/users" element={<UserManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
