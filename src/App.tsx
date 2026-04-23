import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import Landing from './pages/Landing';
import { ThemeProvider } from './components/ThemeProvider';

// User Pages
import Dashboard from './pages/Dashboard';
import Presensi from './pages/Presensi';
import History from './pages/History';
import Profile from './pages/Profile';

import { Users, AlertCircle, CalendarClock, BookOpen, Settings } from 'lucide-react';

function AdminDashboardPlaceholder() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full p-4 md:p-8">
      <div className="mb-4 bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-6">
        <h1 className="font-[Bebas_Neue] text-5xl tracking-wide uppercase text-[#2C2825] dark:text-[#EFEBE1]">Dashboard Administrator</h1>
        <p className="text-[10px] font-bold text-[#6B5A4B] dark:text-[#A89886] uppercase tracking-widest mt-2 border-t-[3px] border-[#2C2825] dark:border-[#EFEBE1] pt-4">Ringkasan aktivitas dan operasional sistem SentraKreasi.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Pegawai', value: '15', icon: Users, color: '#386641', bg: '#EFEBE1', border: '#2C2825' },
          { label: 'Total Siswa', value: '85', icon: BookOpen, color: '#2C2825', bg: '#FAF8F5', border: '#2C2825' },
          { label: 'Anomali Presensi', value: '4', icon: AlertCircle, color: '#E36D4F', bg: '#EFEBE1', border: '#2C2825' },
          { label: 'Aturan Aktif', value: '2', icon: Settings, color: '#386641', bg: '#FAF8F5', border: '#2C2825' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-6 flex items-center gap-5 hover:bg-[#EFEBE1] dark:hover:bg-[#1E1C1A] transition-colors group">
            <div className={`w-14 h-14 bg-[${stat.bg}] dark:bg-[#151413] border-[3px] border-[${stat.border}] dark:border-[#EFEBE1] flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-6 h-6 text-[${stat.color}] dark:text-[#EFEBE1]`} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#6B5A4B] dark:text-[#A89886] uppercase tracking-widest">{stat.label}</p>
              <h3 className="font-[Bebas_Neue] text-5xl text-[#2C2825] dark:text-[#EFEBE1] leading-none mt-1.5">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pb-6">
        <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-8 transition-colors">
          <div className="flex justify-between items-center mb-6 pb-4 border-b-[3px] border-[#2C2825] dark:border-[#EFEBE1]">
            <h3 className="font-[Bebas_Neue] text-3xl text-[#2C2825] dark:text-[#EFEBE1] uppercase">Aktivitas Terkini</h3>
            <button className="text-[#386641] text-[10px] font-bold tracking-widest uppercase hover:underline">Tampilkan</button>
          </div>
          <div className="space-y-5">
             {[
               { name: 'Ahmad Guru', action: 'Memperbarui profil', time: '10:30 AM', color: '#386641' },
               { name: 'Sistem', action: 'Gagal deteksi WAJAH_001', time: '09:15 AM', color: '#E36D4F' },
               { name: 'Siti Aminah', action: 'Mengubah aturan presensi', time: '08:00 AM', color: '#6B5A4B' }
             ].map((log, i) => (
               <div key={i} className="flex gap-4 items-start border-b-[2px] border-[#2C2825] dark:border-[#1E1C1A] pb-5 last:pb-0 last:border-0">
                  <div className={`w-10 h-10 bg-[${log.color}] flex items-center justify-center border-[2px] border-[#2C2825] dark:border-[#EFEBE1] shrink-0`}>
                     <CalendarClock className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">{log.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B5A4B] dark:text-[#A89886] mt-1">{log.action}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#2C2825] dark:text-[#EFEBE1] bg-[#EFEBE1] dark:bg-[#1E1C1A] px-2 py-1 border-[2px] border-[#2C2825] dark:border-[#EFEBE1]">{log.time}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-8 flex flex-col transition-colors">
          <h3 className="font-[Bebas_Neue] text-3xl text-[#2C2825] dark:text-[#EFEBE1] uppercase mb-6 pb-4 border-b-[3px] border-[#2C2825] dark:border-[#EFEBE1]">Status Sistem</h3>
          <div className="bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-[#386641] border-[2px] border-[#2C2825] animate-pulse" />
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Google GenAI [Gemini]</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B5A4B] dark:text-[#A89886] mt-0.5">Koneksi stabil</p>
              </div>
            </div>
            <span className="px-3 py-1.5 bg-[#386641] text-white border-[2px] border-[#2C2825] dark:border-[#EFEBE1] text-[10px] font-bold uppercase">NORMAL</span>
          </div>
          
          <h3 className="font-[Bebas_Neue] text-3xl text-[#2C2825] dark:text-[#EFEBE1] uppercase mb-4 mt-8 pb-4 border-b-[3px] border-[#2C2825] dark:border-[#EFEBE1]">Target Akses</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] text-left hover:bg-[#FAF8F5] dark:hover:bg-[#2A2621] transition-colors group">
               <Users className="w-6 h-6 text-[#2C2825] dark:text-[#EFEBE1] mb-3 group-hover:scale-110 transition-transform" />
               <p className="text-sm font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Data Pegawai</p>
               <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B5A4B] dark:text-[#A89886] mt-1">Kelola Staff</p>
            </button>
            <button className="p-4 bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] text-left hover:bg-[#FAF8F5] dark:hover:bg-[#2A2621] transition-colors group">
               <Settings className="w-6 h-6 text-[#2C2825] dark:text-[#EFEBE1] mb-3 group-hover:scale-110 transition-transform" />
               <p className="text-sm font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Aturan Global</p>
               <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B5A4B] dark:text-[#A89886] mt-1">Konfigurasi Set</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const DataPegawaiPlaceholder = () => <div className="p-4 md:p-8 max-w-6xl mx-auto h-full"><div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] rounded-none p-8 h-full transition-colors"><h1 className="font-[Bebas_Neue] text-5xl tracking-wide text-[#2C2825] dark:text-[#EFEBE1] uppercase mb-2">Data Pegawai & Siswa</h1><p className="text-[10px] font-bold uppercase tracking-widest text-[#6B5A4B] dark:text-[#A89886] border-t-[3px] border-[#2C2825] dark:border-[#EFEBE1] pt-4">Manajemen data pengguna aktif dan histori biometrik.</p></div></div>;
const AturanPresensiPlaceholder = () => <div className="p-4 md:p-8 max-w-6xl mx-auto h-full"><div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] rounded-none p-8 h-full transition-colors"><h1 className="font-[Bebas_Neue] text-5xl tracking-wide text-[#2C2825] dark:text-[#EFEBE1] uppercase mb-2">Aturan Presensi</h1><p className="text-[10px] font-bold uppercase tracking-widest text-[#6B5A4B] dark:text-[#A89886] border-t-[3px] border-[#2C2825] dark:border-[#EFEBE1] pt-4">Konfigurasi parameter waktu kehadiran sekolah.</p></div></div>;
const AdminHistoryPlaceholder = () => <div className="p-4 md:p-8 max-w-6xl mx-auto h-full"><div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] rounded-none p-8 h-full transition-colors"><h1 className="font-[Bebas_Neue] text-5xl tracking-wide text-[#2C2825] dark:text-[#EFEBE1] uppercase mb-2">Riwayat Global</h1><p className="text-[10px] font-bold uppercase tracking-widest text-[#6B5A4B] dark:text-[#A89886] border-t-[3px] border-[#2C2825] dark:border-[#EFEBE1] pt-4">Aktivitas dan absensi seluruh entitas PAUD.</p></div></div>;

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/user" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="presensi" element={<Presensi />} />
            <Route path="history" element={<History />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPlaceholder />} />
            <Route path="pegawai" element={<DataPegawaiPlaceholder />} />
            <Route path="aturan" element={<AturanPresensiPlaceholder />} />
            <Route path="history" element={<AdminHistoryPlaceholder />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
