import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import AdminLayout from './components/layout/AdminLayout';
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import { ThemeProvider } from './components/ThemeProvider';

// User Pages
import Dashboard from './pages/Dashboard';
import Presensi from './pages/Presensi';
import History from './pages/History';
import Profile from './pages/Profile';
import RegisterFace from './pages/RegisterFace';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPegawai from './pages/admin/AdminPegawai';
import AdminAturan from './pages/admin/AdminAturan';
import AdminHistory from './pages/admin/AdminHistory';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          
          <Route path="/user" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="presensi" element={<Presensi />} />
            <Route path="history" element={<History />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="register" element={<RegisterFace />} />
            <Route path="pegawai" element={<AdminPegawai />} />
            <Route path="aturan" element={<AdminAturan />} />
            <Route path="history" element={<AdminHistory />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
