import { Plus, Power, Trash2, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminAturan() {
 const [aturan, setAturan] = useState<any[]>([]);
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  fetchAturan();
 }, []);

 async function fetchAturan() {
  setIsLoading(true);
  const { data, error } = await supabase.from('aturan_presensi').select('*').order('created_at', { ascending: true });
  if (!error && data) setAturan(data);
  setIsLoading(false);
 }

 const toggleStatus = async (id: string, currentStatus: boolean) => {
  await supabase.from('aturan_presensi').update({ is_active: !currentStatus }).eq('id', id);
  fetchAturan();
 };

 const handleDelete = async (id: string) => {
  if (!confirm('Hapus aturan ini?')) return;
  await supabase.from('aturan_presensi').delete().eq('id', id);
  fetchAturan();
 };

 return (
  <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full p-4 md:p-8 text-slate-900 dark:text-white relative">
   <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-green-400/20 dark:bg-green-500/10 rounded-full blur-[150px] pointer-events-none -z-10 mix-blend-screen"></div>

   <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 p-8 rounded-3xl w-full md:w-auto relative overflow-hidden">
     <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/30 dark:bg-green-500/20 blur-3xl rounded-full"></div>
     <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/60">Aturan Presensi</h1>
     <p className="text-sm font-medium text-slate-700 dark:text-white/50 mt-2">Konfigurasi jam kerja dan toleransi keterlambatan.</p>
    </div>
    
    <button className="p-3 px-6 rounded-full border border-green-500/30 bg-green-500 text-white dark:text-black dark:text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-green-400 flex items-center gap-2 text-sm font-bold transition-all">
     <Plus className="w-4 h-4" />
     <span>Tambah Aturan</span>
    </button>
   </div>

   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {isLoading ? (
      <div className="col-span-full py-20 flex justify-center items-center text-slate-700 dark:text-white/50">
       <Loader2 className="w-8 h-8 animate-spin text-green-400" />
      </div>
    ) : aturan.length === 0 ? (
      <div className="col-span-full py-20 text-center text-slate-700 dark:text-white/50 bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 rounded-3xl ">
       <p className="text-sm font-medium">Belum ada aturan yang dibuat.</p>
      </div>
    ) : (
     aturan.map((item) => (
      <div key={item.id} className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 p-6 rounded-3xl flex flex-col relative overflow-hidden group">
       <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
       
       <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${item.is_active ? 'bg-green-500 text-white dark:text-black dark:text-black border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-slate-100 dark:bg-slate-800 shadow-sm dark:shadow-none text-slate-700 dark:text-white/40 border-white/10'}`}>
           <Clock className="w-5 h-5" />
          </div>
          <div>
           <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.nama_aturan}</h3>
           <span className={`text-[10px] font-bold uppercase tracking-widest ${item.is_active ? 'text-green-400' : 'text-slate-700 dark:text-white/40'}`}>
            {item.is_active ? 'Status: Aktif' : 'Status: Nonaktif'}
           </span>
          </div>
        </div>
       </div>

       <div className="space-y-4 flex-1 relative z-10">
         <div className="flex justify-between border-b border-slate-300 dark:border-slate-700 pb-2">
          <span className="text-xs font-medium text-slate-700 dark:text-white/50 uppercase tracking-widest">Jam Masuk</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{item.jam_masuk?.substring(0,5)} WIB</span>
         </div>
         <div className="flex justify-between border-b border-slate-300 dark:border-slate-700 pb-2">
          <span className="text-xs font-medium text-slate-700 dark:text-white/50 uppercase tracking-widest">Jam Keluar</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{item.jam_keluar?.substring(0,5)} WIB</span>
         </div>
         <div className="flex justify-between border-b border-slate-300 dark:border-slate-700 pb-2">
          <span className="text-xs font-medium text-slate-700 dark:text-white/50 uppercase tracking-widest">Toleransi</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{item.toleransi_menit} Menit</span>
         </div>
       </div>

       <div className="flex gap-2 mt-8 pt-4 border-t border-slate-300 dark:border-slate-700 relative z-10">
         <button 
          onClick={() => toggleStatus(item.id, item.is_active)}
          className={`flex-1 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${
           item.is_active 
           ? 'bg-slate-100 dark:bg-slate-800 shadow-sm dark:shadow-none border-slate-300 dark:border-slate-700 text-slate-700 dark:text-white/60 hover:text-white' 
           : 'bg-green-400/20 dark:bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500 hover:text-black'
          }`}
         >
          <Power className="w-4 h-4" /> {item.is_active ? 'Nonaktifkan' : 'Aktifkan'}
         </button>
         <button 
          onClick={() => handleDelete(item.id)}
          className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-slate-900 dark:text-white transition-all"
         >
          <Trash2 className="w-4 h-4" />
         </button>
       </div>
      </div>
     ))
    )}
   </div>
  </div>
 );
}
