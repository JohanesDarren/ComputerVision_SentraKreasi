import { Sliders, Save, Shield, User, Bell } from 'lucide-react';
import { useState } from 'react';

export default function AdminSettings() {
 const [activeTab, setActiveTab] = useState('admin');
 const [isSaving, setIsSaving] = useState(false);

 const handleSave = (e: React.FormEvent) => {
  e.preventDefault();
  setIsSaving(true);
  setTimeout(() => {
   setIsSaving(false);
   alert('Pengaturan berhasil disimpan!');
  }, 1000);
 };

 return (
  <div className="w-full max-w-none mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full p-4 md:p-8 text-slate-900 dark:text-white relative">
   <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 p-8 rounded-3xl w-full relative overflow-hidden">
    <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/60">Settings Sistem</h1>
    <p className="text-sm font-medium text-slate-700 dark:text-white/50 mt-2">Konfigurasi preferensi administrator dan pengaturan lanjutan.</p>
   </div>

   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div className="md:col-span-1 bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 rounded-3xl p-4 flex flex-col gap-2">
     <button 
      onClick={() => setActiveTab('admin')} 
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${activeTab === 'admin' ? 'bg-green-500 text-white dark:text-black' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white/70'}`}
     >
      <Shield className="w-5 h-5" /> Keamanan Admin
     </button>
     <button 
      onClick={() => setActiveTab('user')} 
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${activeTab === 'user' ? 'bg-green-500 text-white dark:text-black' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white/70'}`}
     >
      <User className="w-5 h-5" /> Pengaturan Pengguna
     </button>
     <button 
      onClick={() => setActiveTab('notif')} 
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${activeTab === 'notif' ? 'bg-green-500 text-white dark:text-black' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white/70'}`}
     >
      <Bell className="w-5 h-5" /> Notifikasi Sistem
     </button>
    </div>

    <div className="md:col-span-3 bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 rounded-3xl p-8">
     <form onSubmit={handleSave} className="space-y-6">
      {activeTab === 'admin' && (
       <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
        <h3 className="text-xl font-bold border-b border-slate-300 dark:border-slate-700 pb-4 mb-6">Ubah Kata Sandi Administrator</h3>
        <div className="space-y-2">
         <label className="text-xs font-medium text-slate-700 dark:text-white/70">Kata Sandi Lama</label>
         <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:border-green-500" />
        </div>
        <div className="space-y-2">
         <label className="text-xs font-medium text-slate-700 dark:text-white/70">Kata Sandi Baru</label>
         <input type="password" placeholder="Minimal 8 karakter" className="w-full px-4 py-3 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:border-green-500" />
        </div>
       </div>
      )}

      {activeTab === 'user' && (
       <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
        <h3 className="text-xl font-bold border-b border-slate-300 dark:border-slate-700 pb-4 mb-6">Pengaturan Akun Pengguna</h3>
        <div className="space-y-2 flex items-center justify-between bg-slate-200 dark:bg-slate-700 p-4 rounded-xl">
         <div>
          <h4 className="font-semibold text-sm">Izinkan Pendaftaran Mandiri</h4>
          <p className="text-xs text-slate-500 dark:text-white/50">Pengguna dapat mendaftar tanpa verifikasi admin.</p>
         </div>
         <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
         </label>
        </div>
       </div>
      )}

      {activeTab === 'notif' && (
       <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
        <h3 className="text-xl font-bold border-b border-slate-300 dark:border-slate-700 pb-4 mb-6">Notifikasi Sistem</h3>
        <div className="space-y-2 flex items-center justify-between bg-slate-200 dark:bg-slate-700 p-4 rounded-xl">
         <div>
          <h4 className="font-semibold text-sm">Notifikasi Telegram</h4>
          <p className="text-xs text-slate-500 dark:text-white/50">Kirim laporan harian ke grup Telegram.</p>
         </div>
         <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" />
          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
         </label>
        </div>
       </div>
      )}

      <div className="pt-6 mt-6 border-t border-slate-300 dark:border-slate-700 flex justify-end">
       <button type="submit" disabled={isSaving} className="px-6 py-3 bg-green-500 text-white dark:text-black font-bold rounded-xl flex items-center gap-2 hover:bg-green-400 disabled:opacity-50">
        <Save className="w-4 h-4" /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
       </button>
      </div>
     </form>
    </div>
   </div>
  </div>
 );
}
