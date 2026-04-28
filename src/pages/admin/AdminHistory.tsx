import { Calendar, Search, Filter, Loader2, Download, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

export default function AdminHistory() {
 const [historyData, setHistoryData] = useState<any[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [searchQuery, setSearchQuery] = useState('');
 const [dateFilter, setDateFilter] = useState('');
 const [currentPage, setCurrentPage] = useState(1);
 const ITEMS_PER_PAGE = 8;

 const handleDelete = async (id: string) => {
  if (!confirm('Apakah Anda yakin ingin menghapus data presensi ini? Pegawai akan bisa presensi ulang.')) return;
  const { error } = await supabase.from('presensi').delete().eq('id', id);
  if (!error) {
   setHistoryData(prev => prev.filter(item => item.id !== id));
  } else {
   alert('Gagal menghapus data: ' + error.message);
  }
 };

 const filteredData = historyData.filter(item => {
  const matchName = item.pegawai?.nama?.toLowerCase().includes(searchQuery.toLowerCase()) || 
           item.pegawai?.nip?.toLowerCase().includes(searchQuery.toLowerCase());
  const matchDate = dateFilter ? format(new Date(item.waktu_hadir), 'yyyy-MM-dd') === dateFilter : true;
  return matchName && matchDate;
 });

 useEffect(() => {
  setCurrentPage(1);
 }, [searchQuery, dateFilter]);

 const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
 const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

 useEffect(() => {
  async function fetchHistory() {
   setIsLoading(true);
   
   const todayDate = new Date();
   todayDate.setHours(0, 0, 0, 0);
   
   const { data: allData } = await supabase
    .from('presensi')
    .select('*')
    .lt('waktu_hadir', todayDate.toISOString())
    .order('waktu_hadir', { ascending: false })
    .limit(1000);
    
   if (allData) {
    const toInsert: any[] = [];
    const grouped = new Map();
    for (const row of allData) {
     const dateStr = format(new Date(row.waktu_hadir), 'yyyy-MM-dd');
     const key = `${dateStr}_${row.pegawai_id}`;
     if (!grouped.has(key)) grouped.set(key, []);
     grouped.get(key).push(row);
    }
    for (const [key, records] of grouped.entries()) {
     const hasMasuk = records.some((r: any) => ['masuk', 'telat', 'hadir'].includes(r.status));
     const hasPulang = records.some((r: any) => ['pulang', 'tidak absen pulang'].includes(r.status));
     if (hasMasuk && !hasPulang) {
      const [dateStr, pegawaiId] = key.split('_');
      const endOfDay = new Date(dateStr);
      
      const aturanData = localStorage.getItem('app_aturan_standar');
      let jamBatas = '23:59';
      if (aturanData) {
        const parsed = JSON.parse(aturanData);
        if (parsed.jam_batas_pulang) jamBatas = parsed.jam_batas_pulang;
      }
      const [bH, bM] = jamBatas.split(':').map(Number);
      endOfDay.setHours(bH, bM, 59);
      toInsert.push({
       pegawai_id: pegawaiId,
       status: 'tidak absen pulang',
       waktu_hadir: endOfDay.toISOString(),
       gambar_bukti_url: null
      });
     }
    }
    if (toInsert.length > 0) await supabase.from('presensi').insert(toInsert);
   }

   const { data, error } = await supabase
    .from('presensi')
    .select(`
     id,
     waktu_hadir,
     status,
     gambar_bukti_url,
     pegawai:pegawai_id (
      nama,
      nip
     )
    `)
    .order('waktu_hadir', { ascending: false });

   if (error) console.error('Error fetching history:', error);
   else setHistoryData(data || []);
   setIsLoading(false);
  }

  fetchHistory();
 }, []);

 return (
  <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full p-4 md:p-8 text-slate-900 dark:text-white relative">
   <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-green-400/30 dark:bg-green-500/20 rounded-full blur-[150px] pointer-events-none -z-10 mix-blend-screen"></div>

   <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 relative z-10">
    <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 p-8 rounded-3xl w-full md:w-auto relative overflow-hidden">
     <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/30 dark:bg-green-500/20 blur-3xl rounded-full"></div>
     <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/60 relative z-10">Log Aktivitas (Global)</h1>
     <p className="text-sm font-medium text-slate-700 dark:text-white/50 mt-2 relative z-10">Pantau seluruh riwayat presensi dari semua pengguna.</p>
    </div>
    
    <div className="flex items-center gap-3">
     <div className="relative">
      <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 dark:text-white/40" />
      <input 
       type="text" 
       value={searchQuery}
       onChange={(e) => setSearchQuery(e.target.value)}
       placeholder="Cari NIP / Nama..." 
       className="pl-12 pr-4 py-3 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm dark:shadow-none text-sm focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 w-full md:w-48 lg:w-64 transition-all shadow-inner"
      />
     </div>
     <div className="relative">
      <input 
       type="date" 
       value={dateFilter}
       onChange={(e) => setDateFilter(e.target.value)}
       className="px-4 py-3 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm dark:shadow-none text-sm focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 text-slate-900 dark:text-white w-full md:w-40 transition-all shadow-inner"
      />
     </div>
     <button className="p-3 px-6 rounded-full border border-green-500/30 bg-green-500 text-white dark:text-black dark:text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-green-400 flex items-center gap-2 text-sm font-bold transition-all">
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Export CSV</span>
     </button>
    </div>
   </div>

   <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 rounded-3xl overflow-hidden flex flex-col transition-colors relative z-10">
    <div className="p-6 border-b border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm dark:shadow-none flex justify-between items-center">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Data Presensi Pegawai</h3>
    </div>
    <div className="overflow-x-auto">
     <table className="w-full text-left border-collapse min-w-[700px]">
      <thead>
       <tr className="border-b border-slate-300 dark:border-slate-700 bg-black/20">
        <th className="py-4 px-6 text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest">Profil</th>
        <th className="py-4 px-6 text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest">Waktu</th>
        <th className="py-4 px-6 text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest">Status</th>
        <th className="py-4 px-6 text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest text-right">Detail</th>
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
       ) : filteredData.length === 0 ? (
        <tr>
         <td colSpan={4} className="py-16 text-center text-slate-700 dark:text-white/50">
          <div className="text-sm font-semibold">Tidak ada data presensi yang sesuai.</div>
         </td>
        </tr>
       ) : paginatedData.map((item) => (
        <tr key={item.id} className="hover:bg-slate-100 dark:bg-slate-800 shadow-sm dark:shadow-none transition-colors group">
         <td className="py-4 px-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-slate-200 dark:bg-slate-700 shadow-sm dark:shadow-none text-slate-700 dark:text-white/80 border border-slate-300 dark:border-slate-700 group-hover:bg-green-500 group-hover:text-white dark:text-black transition-colors overflow-hidden shrink-0">
            {item.gambar_bukti_url ? (
              <img src={item.gambar_bukti_url} alt="Presensi" className="w-full h-full object-cover" />
            ) : (
              item.pegawai?.nama?.substring(0, 2).toUpperCase() || '??'
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.pegawai?.nama || 'Unknown'}</p>
            <p className="text-xs font-medium text-slate-700 dark:text-white/40 mt-0.5">{item.pegawai?.nip || '-'}</p>
          </div>
         </td>
         <td className="py-4 px-6">
          <div className="text-lg font-bold text-slate-900 dark:text-white">
           {item.waktu_hadir ? format(new Date(item.waktu_hadir), 'HH:mm') : '-'}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-white/40 mt-0.5">
            <Calendar className="w-3 h-3" />
            {item.waktu_hadir ? format(new Date(item.waktu_hadir), 'dd MMM yyyy', { locale: localeID }) : '-'}
          </div>
         </td>
         <td className="py-4 px-6">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border text-center
           ${(item.status === 'masuk' || item.status === 'hadir') ? 'bg-green-400/20 dark:bg-green-500/10 text-green-400 border-green-500/20' : 
            item.status === 'pulang' ? 'bg-blue-400/20 dark:bg-blue-500/10 text-blue-500 border-blue-500/20' : 
            item.status === 'telat' ? 'bg-orange-400/20 dark:bg-orange-500/10 text-orange-500 border-orange-500/20' : 
            'bg-red-500/10 text-red-400 border-red-500/20'}
          `}>
           {item.status}
          </span>
         </td>
         <td className="py-4 px-6">
          <div className="flex justify-end gap-2 items-center">
           <button onClick={() => handleDelete(item.id)} title="Hapus Presensi" className="p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
            <Trash2 className="w-4 h-4" />
           </button>
          </div>
         </td>
        </tr>
       ))}
      </tbody>
     </table>
    </div>
    
    <div className="p-5 bg-slate-100 dark:bg-slate-800 shadow-sm dark:shadow-none border-t border-slate-300 dark:border-slate-700 flex items-center justify-between">
     <span className="text-xs font-medium text-slate-700 dark:text-white/40">Total Record: {filteredData.length} &bull; Halaman {currentPage} dari {totalPages}</span>
     <div className="flex gap-2">
      <button 
       onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
       disabled={currentPage === 1}
       className="px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-white/70 hover:bg-slate-200 dark:bg-slate-700 shadow-sm dark:shadow-none hover:text-slate-900 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">Prev</button>
      <button 
       onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
       disabled={currentPage === totalPages}
       className="px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-white/70 hover:bg-slate-200 dark:bg-slate-700 shadow-sm dark:shadow-none hover:text-slate-900 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
     </div>
    </div>
   </div>
  </div>
 );
}
