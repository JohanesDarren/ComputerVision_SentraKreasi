import os

content = """import { Clock, Edit2, Loader2, Save, X, Trash2, Calendar, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

export default function AdminAturan() {
 const [aturan, setAturan] = useState<any>(null);
 const [isLoading, setIsLoading] = useState(true);
 const [showModal, setShowModal] = useState(false);
 const [formData, setFormData] = useState<any>(null);
 const [newLiburDate, setNewLiburDate] = useState('');

 useEffect(() => {
  loadAturan();
 }, []);

 const loadAturan = () => {
  setIsLoading(true);
  const data = localStorage.getItem('app_aturan_standar');
  if (data) {
   setAturan(JSON.parse(data));
  } else {
   const defaultAturan = {
    jam_masuk: '07:00',
    jam_keluar: '17:00',
    toleransi_menit: 15,
    jam_batas_pulang: '23:59',
    hari_libur: [] as string[]
   };
   localStorage.setItem('app_aturan_standar', JSON.stringify(defaultAturan));
   setAturan(defaultAturan);
  }
  setIsLoading(false);
 };

 const handleEdit = () => {
  setFormData({ ...aturan, hari_libur: aturan.hari_libur || [] });
  setNewLiburDate('');
  setShowModal(true);
 };

 const handleSave = (e: React.FormEvent) => {
  e.preventDefault();
  localStorage.setItem('app_aturan_standar', JSON.stringify(formData));
  setAturan(formData);
  setShowModal(false);
 };

 const addHariLibur = () => {
  if (!newLiburDate) return;
  if (!formData.hari_libur.includes(newLiburDate)) {
   setFormData({
    ...formData,
    hari_libur: [...formData.hari_libur, newLiburDate].sort()
   });
  }
  setNewLiburDate('');
 };

 const removeHariLibur = (dateVal: string) => {
  setFormData({
   ...formData,
   hari_libur: formData.hari_libur.filter((d: string) => d !== dateVal)
  });
 };

 return (
  <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full p-4 md:p-8 text-slate-900 dark:text-white relative">
   <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-green-400/20 dark:bg-green-500/10 rounded-full blur-[150px] pointer-events-none -z-10 mix-blend-screen"></div>

   <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 p-8 rounded-3xl w-full relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/30 dark:bg-green-500/20 blur-3xl rounded-full"></div>
    <div className="relative z-10">
     <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/60">Aturan Presensi</h1>
     <p className="text-sm font-medium text-slate-700 dark:text-white/50 mt-2">Konfigurasi jam kerja dan tanggal libur nasional.</p>
    </div>
    <div className="relative z-10">
      <button onClick={handleEdit} className="p-3 px-8 rounded-full border border-green-500/30 bg-green-500 text-white dark:text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-green-400 flex items-center gap-2 text-sm font-bold transition-all">
       <Edit2 className="w-4 h-4" />
       <span>Update Aturan</span>
      </button>
    </div>
   </div>

   {isLoading ? (
    <div className="py-20 flex justify-center items-center text-slate-700 dark:text-white/50">
     <Loader2 className="w-8 h-8 animate-spin text-green-400" />
    </div>
   ) : aturan && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
     {/* Kartu Jam Kerja */}
     <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 p-8 rounded-3xl relative overflow-hidden group">
      <div className="flex items-center gap-4 mb-8">
       <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-green-400/20 dark:bg-green-500/10 text-green-500 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
        <Clock className="w-6 h-6" />
       </div>
       <h3 className="text-xl font-bold text-slate-900 dark:text-white">Jam Kerja Standar</h3>
      </div>
      <div className="space-y-5">
       <div className="flex justify-between items-center border-b border-slate-300 dark:border-slate-700 pb-3">
        <span className="text-sm font-medium text-slate-700 dark:text-white/50 uppercase tracking-widest">Jam Masuk</span>
        <span className="text-lg font-bold text-slate-900 dark:text-white">{aturan.jam_masuk} WIB</span>
       </div>
       <div className="flex justify-between items-center border-b border-slate-300 dark:border-slate-700 pb-3">
        <span className="text-sm font-medium text-slate-700 dark:text-white/50 uppercase tracking-widest">Jam Pulang</span>
        <span className="text-lg font-bold text-slate-900 dark:text-white">{aturan.jam_keluar} WIB</span>
       </div>
       <div className="flex justify-between items-center border-b border-slate-300 dark:border-slate-700 pb-3">
        <span className="text-sm font-medium text-slate-700 dark:text-white/50 uppercase tracking-widest">Batas Pulang</span>
        <span className="text-lg font-bold text-slate-900 dark:text-white">{aturan.jam_batas_pulang} WIB</span>
       </div>
       <div className="flex justify-between items-center border-b border-slate-300 dark:border-slate-700 pb-3">
        <span className="text-sm font-medium text-slate-700 dark:text-white/50 uppercase tracking-widest">Toleransi Telat</span>
        <span className="text-lg font-bold text-slate-900 dark:text-white">{aturan.toleransi_menit} Menit</span>
       </div>
      </div>
     </div>

     {/* Kartu Libur Nasional */}
     <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 p-8 rounded-3xl relative overflow-hidden group">
      <div className="flex items-center gap-4 mb-8">
       <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-400/20 dark:bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
        <Calendar className="w-6 h-6" />
       </div>
       <h3 className="text-xl font-bold text-slate-900 dark:text-white">Libur Nasional</h3>
      </div>
      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
       {!aturan.hari_libur || aturan.hari_libur.length === 0 ? (
        <div className="text-center py-6 text-sm font-medium text-slate-700 dark:text-white/40">
         Belum ada tanggal libur yang ditetapkan.
        </div>
       ) : (
        aturan.hari_libur.map((dateStr: string) => (
         <div key={dateStr} className="flex justify-between items-center p-3 px-4 bg-slate-200 dark:bg-slate-700/50 rounded-xl border border-slate-300 dark:border-slate-600">
          <span className="text-sm font-bold text-slate-900 dark:text-white">
           {format(new Date(dateStr), 'dd MMMM yyyy', {locale: localeID})}
          </span>
         </div>
        ))
       )}
      </div>
     </div>
    </div>
   )}

   {/* Modal Edit */}
   {showModal && formData && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
     <div className="bg-slate-100 dark:bg-slate-800 shadow-xl border border-slate-300 dark:border-slate-700 w-full max-w-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
      <div className="p-6 border-b border-slate-300 dark:border-slate-700 flex justify-between items-center shrink-0">
       <h3 className="text-xl font-bold">Update Aturan Standar</h3>
       <button onClick={() => setShowModal(false)} className="text-slate-700 dark:text-white/50 hover:text-slate-900 dark:text-white">
        <X className="w-6 h-6" />
       </button>
      </div>
      
      <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
       
       <div className="grid grid-cols-2 gap-6">
        <div>
         <label className="text-xs font-semibold uppercase tracking-widest text-slate-700 dark:text-white/70 block mb-2">Jam Masuk</label>
         <input required type="time" value={formData.jam_masuk} onChange={e => setFormData({...formData, jam_masuk: e.target.value})} className="w-full px-4 py-3 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:border-green-500 focus:outline-none" />
        </div>
        <div>
         <label className="text-xs font-semibold uppercase tracking-widest text-slate-700 dark:text-white/70 block mb-2">Jam Pulang</label>
         <input required type="time" value={formData.jam_keluar} onChange={e => setFormData({...formData, jam_keluar: e.target.value})} className="w-full px-4 py-3 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:border-green-500 focus:outline-none" />
        </div>
       </div>

       <div className="grid grid-cols-2 gap-6">
        <div>
         <label className="text-xs font-semibold uppercase tracking-widest text-slate-700 dark:text-white/70 block mb-2">Batas Auto-Pulang</label>
         <input required type="time" value={formData.jam_batas_pulang} onChange={e => setFormData({...formData, jam_batas_pulang: e.target.value})} className="w-full px-4 py-3 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:border-green-500 focus:outline-none" />
        </div>
        <div>
         <label className="text-xs font-semibold uppercase tracking-widest text-slate-700 dark:text-white/70 block mb-2">Toleransi Telat (Menit)</label>
         <input required type="number" min="0" value={formData.toleransi_menit} onChange={e => setFormData({...formData, toleransi_menit: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:border-green-500 focus:outline-none" />
        </div>
       </div>

       <div className="border-t border-slate-300 dark:border-slate-700 pt-6">
        <label className="text-xs font-semibold uppercase tracking-widest text-slate-700 dark:text-white/70 block mb-4">Tambahkan Tanggal Libur Nasional</label>
        <div className="flex gap-3 mb-4">
         <input 
          type="date" 
          value={newLiburDate} 
          onChange={e => setNewLiburDate(e.target.value)}
          className="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:border-green-500 focus:outline-none"
         />
         <button type="button" onClick={addHariLibur} className="px-6 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:border-green-500 text-slate-900 dark:text-white font-bold rounded-xl transition-all">
          Tambah
         </button>
        </div>

        <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
         {formData.hari_libur.map((dateStr: string) => (
          <div key={dateStr} className="flex justify-between items-center p-3 px-4 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl">
           <span className="text-sm font-bold text-slate-900 dark:text-white">{format(new Date(dateStr), 'dd MMMM yyyy', {locale: localeID})}</span>
           <button type="button" onClick={() => removeHariLibur(dateStr)} className="text-red-400 hover:text-red-500 p-1">
            <Trash2 className="w-4 h-4" />
           </button>
          </div>
         ))}
         {formData.hari_libur.length === 0 && (
          <p className="text-xs font-medium text-slate-700 dark:text-white/40 italic">Belum ada tanggal libur</p>
         )}
        </div>
       </div>

       <div className="pt-6 flex gap-3 border-t border-slate-300 dark:border-slate-700 shrink-0">
        <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 rounded-xl border border-slate-300 dark:border-slate-600 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
         Batal
        </button>
        <button type="submit" className="flex-1 py-3.5 bg-green-500 text-white font-bold text-sm rounded-xl hover:bg-green-400 transition-colors flex items-center justify-center gap-2">
         <Save className="w-4 h-4" /> Simpan Aturan
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
