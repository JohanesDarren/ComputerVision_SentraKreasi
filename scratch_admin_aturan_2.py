import os

content = """import { Plus, Power, Trash2, Clock, CheckCircle, Loader2, Save, X, Calendar, Edit2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminAturan() {
 const [aturan, setAturan] = useState<any[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [showModal, setShowModal] = useState(false);
 const [formData, setFormData] = useState({
  id: '', nama_aturan: '', jam_masuk: '07:00', jam_keluar: '17:00',
  toleransi_menit: 15, jam_batas_pulang: '23:59', hari_libur: [] as string[],
  is_active: false
 });

 const DAYS = [
  { value: '1', label: 'Senin' },
  { value: '2', label: 'Selasa' },
  { value: '3', label: 'Rabu' },
  { value: '4', label: 'Kamis' },
  { value: '5', label: 'Jumat' },
  { value: '6', label: 'Sabtu' },
  { value: '0', label: 'Minggu' }
 ];

 useEffect(() => {
  loadAturan();
 }, []);

 const loadAturan = () => {
  setIsLoading(true);
  const data = localStorage.getItem('app_aturan');
  if (data) {
   setAturan(JSON.parse(data));
  } else {
   const defaultAturan = [{
    id: Date.now().toString(),
    nama_aturan: 'Aturan Standar',
    jam_masuk: '07:00',
    jam_keluar: '17:00',
    toleransi_menit: 15,
    jam_batas_pulang: '23:59',
    hari_libur: ['0', '6'],
    is_active: true
   }];
   localStorage.setItem('app_aturan', JSON.stringify(defaultAturan));
   setAturan(defaultAturan);
  }
  setIsLoading(false);
 };

 const toggleStatus = (id: string) => {
  const newAturan = aturan.map(a => {
   if (a.id === id) return { ...a, is_active: !a.is_active };
   return { ...a, is_active: false };
  });
  localStorage.setItem('app_aturan', JSON.stringify(newAturan));
  setAturan(newAturan);
 };

 const handleDelete = (id: string) => {
  if (!confirm('Hapus aturan ini?')) return;
  const newAturan = aturan.filter(a => a.id !== id);
  localStorage.setItem('app_aturan', JSON.stringify(newAturan));
  setAturan(newAturan);
 };

 const handleEdit = (item: any) => {
  setFormData(item);
  setShowModal(true);
 };

 const handleAddNew = () => {
  setFormData({
   id: '', nama_aturan: 'Aturan Baru', jam_masuk: '07:00', jam_keluar: '17:00',
   toleransi_menit: 15, jam_batas_pulang: '23:59', hari_libur: ['0', '6'],
   is_active: aturan.length === 0
  });
  setShowModal(true);
 };

 const handleSave = (e: React.FormEvent) => {
  e.preventDefault();
  let newAturan = [...aturan];
  if (formData.id) {
   newAturan = newAturan.map(a => a.id === formData.id ? formData : a);
  } else {
   newAturan.push({ ...formData, id: Date.now().toString() });
  }
  
  if (formData.is_active) {
   newAturan = newAturan.map(a => a.id === formData.id ? a : { ...a, is_active: false });
  }
  
  localStorage.setItem('app_aturan', JSON.stringify(newAturan));
  setAturan(newAturan);
  setShowModal(false);
 };

 const toggleHariLibur = (dayValue: string) => {
  setFormData(prev => ({
   ...prev,
   hari_libur: prev.hari_libur.includes(dayValue) 
    ? prev.hari_libur.filter(d => d !== dayValue) 
    : [...prev.hari_libur, dayValue]
  }));
 };

 return (
  <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full p-4 md:p-8 text-slate-900 dark:text-white relative">
   <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-green-400/20 dark:bg-green-500/10 rounded-full blur-[150px] pointer-events-none -z-10 mix-blend-screen"></div>

   <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 p-8 rounded-3xl w-full md:w-auto relative overflow-hidden">
     <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/30 dark:bg-green-500/20 blur-3xl rounded-full"></div>
     <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/60">Aturan Presensi</h1>
     <p className="text-sm font-medium text-slate-700 dark:text-white/50 mt-2">Konfigurasi jam kerja, hari libur, dan batas pulang.</p>
    </div>
    
    <button onClick={handleAddNew} className="p-3 px-6 rounded-full border border-green-500/30 bg-green-500 text-white dark:text-black dark:text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-green-400 flex items-center gap-2 text-sm font-bold transition-all">
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
      <div key={item.id} className={`bg-slate-100 dark:bg-slate-800 shadow-sm border ${item.is_active ? 'border-green-500/50' : 'border-slate-300 dark:border-slate-700'} p-6 rounded-3xl flex flex-col relative overflow-hidden group`}>
       {item.is_active && <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none"></div>}
       
       <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${item.is_active ? 'bg-green-500 text-white dark:text-black dark:text-black border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-slate-100 dark:bg-slate-800 shadow-sm dark:shadow-none text-slate-700 dark:text-white/40 border-white/10'}`}>
           <Clock className="w-5 h-5" />
          </div>
          <div>
           <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.nama_aturan}</h3>
           <span className={`text-[10px] font-bold uppercase tracking-widest ${item.is_active ? 'text-green-500' : 'text-slate-700 dark:text-white/40'}`}>
            {item.is_active ? 'Status: Aktif' : 'Status: Nonaktif'}
           </span>
          </div>
        </div>
        <button onClick={() => handleEdit(item)} className="p-2 bg-slate-200 dark:bg-slate-700 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
         <Edit2 className="w-4 h-4 text-slate-700 dark:text-white/70" />
        </button>
       </div>

       <div className="space-y-4 flex-1 relative z-10">
         <div className="flex justify-between border-b border-slate-300 dark:border-slate-700 pb-2">
          <span className="text-xs font-medium text-slate-700 dark:text-white/50 uppercase tracking-widest">Jam Masuk</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{item.jam_masuk} WIB</span>
         </div>
         <div className="flex justify-between border-b border-slate-300 dark:border-slate-700 pb-2">
          <span className="text-xs font-medium text-slate-700 dark:text-white/50 uppercase tracking-widest">Jam Pulang</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{item.jam_keluar} WIB</span>
         </div>
         <div className="flex justify-between border-b border-slate-300 dark:border-slate-700 pb-2">
          <span className="text-xs font-medium text-slate-700 dark:text-white/50 uppercase tracking-widest">Batas Pulang</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{item.jam_batas_pulang} WIB</span>
         </div>
         <div className="flex justify-between border-b border-slate-300 dark:border-slate-700 pb-2">
          <span className="text-xs font-medium text-slate-700 dark:text-white/50 uppercase tracking-widest">Toleransi Telat</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{item.toleransi_menit} Menit</span>
         </div>
         <div className="pt-2">
          <span className="text-xs font-medium text-slate-700 dark:text-white/50 uppercase tracking-widest block mb-2">Hari Libur</span>
          <div className="flex flex-wrap gap-1">
           {item.hari_libur?.map((dayVal: string) => {
            const d = DAYS.find(x => x.value === dayVal);
            return <span key={dayVal} className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs font-semibold text-slate-700 dark:text-white/70">{d?.label}</span>
           })}
           {(!item.hari_libur || item.hari_libur.length === 0) && <span className="text-xs text-slate-500">Tidak ada hari libur</span>}
          </div>
         </div>
       </div>

       <div className="flex gap-2 mt-6 pt-4 border-t border-slate-300 dark:border-slate-700 relative z-10">
         <button 
          onClick={() => toggleStatus(item.id)}
          className={`flex-1 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${
           item.is_active 
           ? 'bg-slate-200 dark:bg-slate-700 shadow-sm dark:shadow-none border-slate-300 dark:border-slate-600 text-slate-700 dark:text-white/60 hover:text-white' 
           : 'bg-green-400/20 dark:bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500 hover:text-black'
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

   {showModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
     <div className="bg-slate-100 dark:bg-slate-800 shadow-xl border border-slate-300 dark:border-slate-700 w-full max-w-lg rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="p-6 border-b border-slate-300 dark:border-slate-700 flex justify-between items-center">
       <h3 className="text-xl font-bold">{formData.id ? 'Edit Aturan' : 'Tambah Aturan'}</h3>
       <button onClick={() => setShowModal(false)} className="text-slate-700 dark:text-white/50 hover:text-slate-900 dark:text-white">
        <X className="w-6 h-6" />
       </button>
      </div>
      
      <form onSubmit={handleSave} className="p-6 space-y-4">
       <div>
        <label className="text-xs font-semibold uppercase tracking-widest text-slate-700 dark:text-white/70 block mb-2">Nama Aturan</label>
        <input required type="text" value={formData.nama_aturan} onChange={e => setFormData({...formData, nama_aturan: e.target.value})} className="w-full px-4 py-3 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white focus:border-green-500 focus:outline-none" />
       </div>
       
       <div className="grid grid-cols-2 gap-4">
        <div>
         <label className="text-xs font-semibold uppercase tracking-widest text-slate-700 dark:text-white/70 block mb-2">Jam Masuk</label>
         <input required type="time" value={formData.jam_masuk} onChange={e => setFormData({...formData, jam_masuk: e.target.value})} className="w-full px-4 py-3 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white focus:border-green-500 focus:outline-none" />
        </div>
        <div>
         <label className="text-xs font-semibold uppercase tracking-widest text-slate-700 dark:text-white/70 block mb-2">Jam Pulang</label>
         <input required type="time" value={formData.jam_keluar} onChange={e => setFormData({...formData, jam_keluar: e.target.value})} className="w-full px-4 py-3 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white focus:border-green-500 focus:outline-none" />
        </div>
       </div>

       <div className="grid grid-cols-2 gap-4">
        <div>
         <label className="text-xs font-semibold uppercase tracking-widest text-slate-700 dark:text-white/70 block mb-2">Batas Auto-Pulang</label>
         <input required type="time" value={formData.jam_batas_pulang} onChange={e => setFormData({...formData, jam_batas_pulang: e.target.value})} className="w-full px-4 py-3 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white focus:border-green-500 focus:outline-none" />
        </div>
        <div>
         <label className="text-xs font-semibold uppercase tracking-widest text-slate-700 dark:text-white/70 block mb-2">Toleransi (Menit)</label>
         <input required type="number" min="0" value={formData.toleransi_menit} onChange={e => setFormData({...formData, toleransi_menit: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white focus:border-green-500 focus:outline-none" />
        </div>
       </div>

       <div>
        <label className="text-xs font-semibold uppercase tracking-widest text-slate-700 dark:text-white/70 block mb-2">Hari Libur</label>
        <div className="flex flex-wrap gap-2">
         {DAYS.map(day => (
          <button 
           type="button" 
           key={day.value} 
           onClick={() => toggleHariLibur(day.value)}
           className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${formData.hari_libur.includes(day.value) ? 'bg-green-500 text-white border-green-500' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white/50 border-slate-300 dark:border-slate-600 hover:border-green-500/50'}`}
          >
           {day.label}
          </button>
         ))}
        </div>
       </div>

       <div className="pt-6 flex gap-3">
        <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-600 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
         Batal
        </button>
        <button type="submit" className="flex-1 py-3 bg-green-500 text-white font-bold text-sm rounded-xl hover:bg-green-400 transition-colors">
         Simpan Aturan
        </button>
       </div>
      </form>
     </div>
    </div>
   )}
  </div>
 );
}
"""

with open('src/pages/admin/AdminAturan.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
