import { Users, Search, Plus, Trash2, Edit, AlertCircle, Loader2, X, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminPegawai() {
 const [pegawai, setPegawai] = useState<any[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [showAddModal, setShowAddModal] = useState(false);
 const [newPegawai, setNewPegawai] = useState({ nama: '', nip: '', email: '', password: '' });
 const [isSubmitting, setIsSubmitting] = useState(false);

 useEffect(() => {
  fetchPegawai();
 }, []);

 async function fetchPegawai() {
  setIsLoading(true);
  const { data, error } = await supabase.from('pegawai').select('*').order('created_at', { ascending: false });
  if (!error && data) setPegawai(data);
  setIsLoading(false);
 }

 const handleDelete = async (id: string) => {
  if (!confirm('Yakin ingin menghapus pegawai ini? Data presensi terkait mungkin akan terpengaruh.')) return;
  await supabase.from('pegawai').delete().eq('id', id);
  fetchPegawai();
 };

 const handleAdd = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
   const { error } = await supabase.from('pegawai').insert([newPegawai]);
   if (error) throw error;
   setShowAddModal(false);
   setNewPegawai({ nama: '', nip: '', email: '', password: '' });
   fetchPegawai();
  } catch (err) {
   alert('Gagal menambahkan pegawai. NIP atau Email mungkin sudah digunakan.');
  } finally {
   setIsSubmitting(false);
  }
 };

 return (
  <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full p-4 md:p-8 text-slate-900 dark:text-white relative">
   <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-green-400/20 dark:bg-green-500/10 rounded-full blur-[150px] pointer-events-none -z-10 mix-blend-screen"></div>

   <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 p-8 rounded-3xl w-full md:w-auto relative overflow-hidden">
     <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/30 dark:bg-green-500/20 blur-3xl rounded-full"></div>
     <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/60">Data Pegawai</h1>
     <p className="text-sm font-medium text-slate-700 dark:text-white/50 mt-2">Kelola informasi dan biometrik karyawan.</p>
    </div>
    
    <div className="flex items-center gap-3">
     <div className="relative">
      <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 dark:text-white/40" />
      <input 
       type="text" 
       placeholder="Cari NIP / Nama..." 
       className="pl-12 pr-4 py-3 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm dark:shadow-none text-sm focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 w-full md:w-48 lg:w-64 transition-all shadow-inner"
      />
     </div>
     <button onClick={() => setShowAddModal(true)} className="p-3 px-6 rounded-full border border-green-500/30 bg-green-500 text-white dark:text-black dark:text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-green-400 flex items-center gap-2 text-sm font-bold transition-all">
      <Plus className="w-4 h-4" />
      <span className="hidden sm:inline">Tambah Pegawai</span>
     </button>
    </div>
   </div>

   <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 rounded-3xl overflow-hidden flex flex-col transition-colors ">
    <div className="p-6 border-b border-slate-300 dark:border-slate-700 bg-white/5">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Daftar Pegawai Aktif</h3>
    </div>
    <div className="overflow-x-auto">
     <table className="w-full text-left border-collapse min-w-[800px]">
      <thead>
       <tr className="border-b border-slate-300 dark:border-slate-700 bg-black/20">
        <th className="py-4 px-6 text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest">Profil</th>
        <th className="py-4 px-6 text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest">Email</th>
        <th className="py-4 px-6 text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest">Status Biometrik</th>
        <th className="py-4 px-6 text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest text-right">Aksi</th>
       </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
       {isLoading ? (
        <tr>
         <td colSpan={4} className="py-16 text-center text-slate-700 dark:text-white/50">
          <div className="flex justify-center items-center gap-3 text-sm font-semibold">
           <Loader2 className="w-5 h-5 animate-spin text-green-400" /> Memuat Data...
          </div>
         </td>
        </tr>
       ) : pegawai.length === 0 ? (
        <tr>
         <td colSpan={4} className="py-16 text-center text-slate-700 dark:text-white/50">
          <div className="text-sm font-semibold">Tidak ada data pegawai</div>
         </td>
        </tr>
       ) : pegawai.map((item) => (
        <tr key={item.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/50 shadow-sm dark:shadow-none transition-colors group">
         <td className="py-4 px-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-green-400/20 dark:bg-green-500/10 text-green-400 border border-green-500/20 group-hover:bg-green-500 group-hover:text-white dark:text-black transition-colors overflow-hidden shrink-0">
            {localStorage.getItem(`profile_photo_${item.id}`) ? (
               <img src={localStorage.getItem(`profile_photo_${item.id}`)!} alt="Profil" className="w-full h-full object-cover" />
            ) : (
               item.nama?.substring(0, 2).toUpperCase() || '??'
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.nama}</p>
            <p className="text-xs font-medium text-slate-700 dark:text-white/40 mt-0.5">NIP: {item.nip}</p>
          </div>
         </td>
         <td className="py-4 px-6 text-sm text-slate-700 dark:text-white/70">
          {item.email || '-'}
         </td>
         <td className="py-4 px-6">
          {item.embedding ? (
           <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-500/20 bg-green-400/20 dark:bg-green-500/10 text-green-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Terdaftar
           </span>
          ) : (
           <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-red-500/20 bg-red-500/10 text-red-400">
            <AlertCircle className="w-3 h-3" />
            Belum Terdaftar
           </span>
          )}
         </td>
         <td className="py-4 px-6">
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all">
             <Trash2 className="w-4 h-4" />
            </button>
          </div>
         </td>
        </tr>
       ))}
      </tbody>
     </table>
    </div>
   </div>

   {showAddModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
     <div className="bg-slate-100 dark:bg-slate-800 shadow-xl border border-slate-300 dark:border-slate-700 w-full max-w-md rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="p-6 border-b border-slate-300 dark:border-slate-700 flex justify-between items-center">
       <h3 className="text-xl font-bold">Tambah Pegawai</h3>
       <button onClick={() => setShowAddModal(false)} className="text-slate-700 dark:text-white/50 hover:text-slate-900 dark:text-white">
        <X className="w-6 h-6" />
       </button>
      </div>
      <form onSubmit={handleAdd} className="p-6 space-y-4">
       <div>
        <label className="text-xs font-medium text-slate-700 dark:text-white/70 block mb-1">Nama Lengkap</label>
        <input required type="text" value={newPegawai.nama} onChange={e => setNewPegawai({...newPegawai, nama: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:border-green-500 focus:outline-none" />
       </div>
       <div>
        <label className="text-xs font-medium text-slate-700 dark:text-white/70 block mb-1">NIP</label>
        <input required type="text" value={newPegawai.nip} onChange={e => setNewPegawai({...newPegawai, nip: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:border-green-500 focus:outline-none" />
       </div>
       <div>
        <label className="text-xs font-medium text-slate-700 dark:text-white/70 block mb-1">Email</label>
        <input required type="email" value={newPegawai.email} onChange={e => setNewPegawai({...newPegawai, email: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:border-green-500 focus:outline-none" />
       </div>
       <div>
        <label className="text-xs font-medium text-slate-700 dark:text-white/70 block mb-1">Password</label>
        <input required type="password" value={newPegawai.password} onChange={e => setNewPegawai({...newPegawai, password: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:border-green-500 focus:outline-none" />
       </div>
       <button disabled={isSubmitting} type="submit" className="w-full mt-4 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-colors">
        {isSubmitting ? 'Menyimpan...' : 'Simpan Pegawai'}
       </button>
      </form>
     </div>
    </div>
   )}

  </div>
 );
}
