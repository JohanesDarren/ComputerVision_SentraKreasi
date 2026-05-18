import { Calendar, Search, Filter, Smile, Target, BatteryMedium, Meh, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

export default function History() {
 const [historyData, setHistoryData] = useState<any[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [searchQuery, setSearchQuery] = useState('');
 const [dateFilter, setDateFilter] = useState('');
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 5;

 useEffect(() => {
  async function fetchHistory() {
   setIsLoading(true);
   const userId = localStorage.getItem('user_id');
   if (!userId) {
    setIsLoading(false);
    return;
   }
   
   const todayDate = new Date();
   todayDate.setHours(0, 0, 0, 0);
   
   const { data: allData } = await supabase
    .from('presensi')
    .select('*')
    .eq('pegawai_id', userId)
    .lt('waktu_hadir', todayDate.toISOString())
    .order('waktu_hadir', { ascending: false });
    
   if (allData) {
    const toInsert: any[] = [];
    const grouped = new Map();
    for (const row of allData) {
     const dateStr = format(new Date(row.waktu_hadir), 'yyyy-MM-dd');
     if (!grouped.has(dateStr)) grouped.set(dateStr, []);
     grouped.get(dateStr).push(row);
    }
    for (const [dateStr, records] of grouped.entries()) {
     const hasMasuk = records.some((r: any) => ['masuk', 'telat', 'hadir'].includes(r.status));
     const hasPulang = records.some((r: any) => ['pulang', 'tidak absen pulang'].includes(r.status));
     if (hasMasuk && !hasPulang) {
      const endOfDay = new Date(dateStr);
      endOfDay.setHours(23, 59, 59);
      toInsert.push({
       pegawai_id: userId,
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
    .select(`id, waktu_hadir, status, gambar_bukti_url, pegawai:pegawai_id (nama, nip)`)
    .eq('pegawai_id', userId)
    .order('waktu_hadir', { ascending: false })
    .limit(1000);

   if (error) console.error('Error fetching history:', error);
   else setHistoryData(data || []);
   setIsLoading(false);
  }
  fetchHistory();
 }, []);

 const filteredData = historyData.filter(item => {
  const matchStatus = item.status?.toLowerCase().includes(searchQuery.toLowerCase());
  const matchDate = dateFilter ? format(new Date(item.waktu_hadir), 'yyyy-MM-dd') === dateFilter : true;
  return matchStatus && matchDate;
 });

 const totalPages = Math.ceil(filteredData.length / itemsPerPage);
 const displayData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

 return (
  <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900 dark:text-white relative">
   
   {/* Background Glows */}
   <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-green-400/30 dark:bg-green-500/20 rounded-full blur-[150px] pointer-events-none -z-10 mix-blend-screen"></div>

   <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 relative z-10">
    <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 p-5 rounded-2xl w-full md:w-auto relative overflow-hidden">
     <div className="absolute top-0 left-0 w-32 h-32 bg-green-400/30 dark:bg-green-500/20 blur-3xl rounded-full"></div>
     <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/60 relative z-10">Riwayat Presensi</h1>
     <p className="text-xs font-medium text-slate-700 dark:text-white/50 mt-1 relative z-10">Catatan dan log waktu kehadiran terpadu.</p>
    </div>
    
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
     <div className="flex flex-col gap-0.5 w-full sm:w-auto">
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-2">Filter berdasarkan Status</span>
      <div className="relative">
       <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 dark:text-white/40" />
       <input 
        type="text" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Cari Status (hadir, pulang...)" 
        className="pl-10 pr-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm dark:shadow-none text-xs focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 w-full md:w-48 lg:w-64 transition-all shadow-inner"
       />
      </div>
     </div>
     <div className="flex flex-col gap-0.5 w-full sm:w-auto">
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-2">Filter berdasarkan Tanggal</span>
      <div className="relative">
       <input 
        type="date" 
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
        className="px-3 py-2 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm dark:shadow-none text-xs focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 text-slate-900 dark:text-white w-full md:w-40 transition-all shadow-inner"
       />
      </div>
     </div>
    </div>
   </div>

   <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden flex flex-col transition-colors relative z-10">
    <div className="p-4 border-b border-slate-300 dark:border-slate-700 bg-white/5 flex justify-between items-center">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Log Area Pindai</h3>
    </div>
    <div className="overflow-x-auto">
     <table className="w-full text-left border-collapse min-w-[700px]">
      <thead>
       <tr className="border-b border-white/10">
        <th className="py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest">Profil</th>
        <th className="py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest">Waktu</th>
        <th className="py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest">Status</th>
        <th className="py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest">Metode</th>
        <th className="py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest">Ekspresi</th>
       </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
       {isLoading ? (
        <tr>
         <td colSpan={5} className="py-10 text-center text-slate-700 dark:text-white/50">
          <div className="flex justify-center items-center gap-3 text-sm font-semibold">
           <Loader2 className="w-5 h-5 animate-spin text-green-400" /> Memuat Data...
          </div>
         </td>
        </tr>
       ) : displayData.length === 0 ? (
        <tr>
         <td colSpan={5} className="py-10 text-center text-slate-700 dark:text-white/50">
          <div className="text-sm font-semibold">Belum ada riwayat presensi</div>
         </td>
        </tr>
       ) : displayData.map((item) => (
        <tr key={item.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/50 shadow-sm dark:shadow-none transition-colors group">
         <td className="py-2.5 px-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-green-400/20 dark:bg-green-500/10 text-green-400 border border-green-500/20 group-hover:bg-green-500 group-hover:text-white dark:text-black transition-colors overflow-hidden shrink-0">
            {item.gambar_bukti_url ? (
              <img src={item.gambar_bukti_url} alt="Presensi" className="w-full h-full object-cover" />
            ) : (
              item.pegawai?.nama?.substring(0, 2).toUpperCase() || '??'
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">{item.pegawai?.nama || 'Unknown'}</p>
            <p className="text-[10px] font-medium text-slate-700 dark:text-white/40 mt-0.5">{item.pegawai?.nip || '-'}</p>
          </div>
         </td>
         <td className="py-2.5 px-4">
          <div className="text-sm font-bold text-slate-900 dark:text-white">
           {item.waktu_hadir ? format(new Date(item.waktu_hadir), 'HH:mm') : '-'}
          </div>
          <div className="flex items-center gap-1 text-[10px] font-medium text-slate-700 dark:text-white/40 mt-0.5">
            <Calendar className="w-2.5 h-2.5" />
            {item.waktu_hadir ? format(new Date(item.waktu_hadir), 'dd MMM yyyy', { locale: localeID }) : '-'}
          </div>
         </td>
         <td className="py-2.5 px-4">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border text-center
           ${(item.status === 'masuk' || item.status === 'hadir') ? 'bg-green-400/20 dark:bg-green-500/10 text-green-400 border-green-500/20' : 
            item.status === 'pulang' ? 'bg-blue-400/20 dark:bg-blue-500/10 text-blue-500 border-blue-500/20' : 
            item.status === 'telat' ? 'bg-orange-400/20 dark:bg-orange-500/10 text-orange-500 border border-orange-500/20' : 
            'bg-red-500/10 text-red-400 border border-red-500/20'}
          `}>
           {item.status}
          </span>
         </td>
         <td className="py-2.5 px-4 text-xs font-medium text-slate-700 dark:text-white/70">Wajah (AI)</td>
         <td className="py-2.5 px-4">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 shadow-sm dark:shadow-none px-2 py-1 rounded-full border border-slate-300 dark:border-slate-700 w-max group-hover:bg-green-400/20 dark:bg-green-500/10 group-hover:border-green-500/30 group-hover:text-green-400 transition-colors">
            <Smile className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold">Terdeteksi</span>
          </div>
         </td>
        </tr>
       ))}
      </tbody>
     </table>
    </div>
    
    <div className="p-5 bg-slate-100 dark:bg-slate-800 shadow-sm dark:shadow-none border-t border-slate-300 dark:border-slate-700 flex items-center justify-between">
     <span className="text-xs font-medium text-slate-700 dark:text-white/40">Menampilkan {displayData.length} dari {filteredData.length} entri</span>
     <div className="flex gap-2">
      <button 
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 disabled:opacity-50 hover:bg-slate-200 dark:hover:bg-slate-700"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="px-3 py-2 text-sm font-medium border border-slate-300 dark:border-slate-700 rounded-lg">
        {currentPage} / {Math.max(1, totalPages)}
      </span>
      <button 
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages || totalPages === 0}
        className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 disabled:opacity-50 hover:bg-slate-200 dark:hover:bg-slate-700"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
     </div>
    </div>
   </div>
  </div>
 );
}
