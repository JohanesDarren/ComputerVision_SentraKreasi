import { Calendar, Search, Filter, Smile, Target, BatteryMedium, Meh, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

export default function History() {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('presensi')
        .select(`id, waktu_hadir, status, pegawai:pegawai_id (nama, nip)`)
        .order('waktu_hadir', { ascending: false })
        .limit(20);

      if (error) console.error('Error fetching history:', error);
      else setHistoryData(data || []);
      setIsLoading(false);
    }
    fetchHistory();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full p-4 md:p-8 text-slate-900 dark:text-white relative">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-green-400/30 dark:bg-green-500/20 rounded-full blur-[150px] pointer-events-none -z-10 mix-blend-screen"></div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 relative z-10">
        <div className="bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 p-8 rounded-3xl backdrop-blur-xl w-full md:w-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-green-400/30 dark:bg-green-500/20 blur-3xl rounded-full"></div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/60 relative z-10">Riwayat Presensi</h1>
          <p className="text-sm font-medium text-slate-700 dark:text-white/50 mt-2 relative z-10">Catatan dan log waktu kehadiran terpadu.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 dark:text-white/40" />
            <input 
              type="text" 
              placeholder="Cari..." 
              className="pl-12 pr-4 py-3 rounded-full border border-slate-900/10 dark:border-white/10 bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none text-sm focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 w-full md:w-48 lg:w-64 transition-all backdrop-blur-md shadow-inner"
            />
          </div>
          <button className="p-3 px-6 rounded-full border border-slate-900/10 dark:border-white/10 bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none hover:bg-white/90 dark:bg-white/10 shadow-xl dark:shadow-none flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white transition-all backdrop-blur-md">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      <div className="bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col transition-colors backdrop-blur-xl relative z-10">
        <div className="p-6 border-b border-slate-900/10 dark:border-white/10 bg-white/5">
           <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Log Area Pindai</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-6 text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest">Profil</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest">Waktu</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest">Metode</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest">Ekspresi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-700 dark:text-white/50">
                    <div className="flex justify-center items-center gap-3 text-sm font-semibold">
                      <Loader2 className="w-5 h-5 animate-spin text-green-400" /> Memuat Data...
                    </div>
                  </td>
                </tr>
              ) : historyData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-700 dark:text-white/50">
                    <div className="text-sm font-semibold">Belum ada riwayat presensi</div>
                  </td>
                </tr>
              ) : historyData.map((item) => (
                <tr key={item.id} className="hover:bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none transition-colors group">
                  <td className="py-4 px-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-green-400/20 dark:bg-green-500/10 text-green-400 border border-green-500/20 group-hover:bg-green-500 group-hover:text-white dark:text-black transition-colors">
                       {item.pegawai?.nama?.substring(0, 2).toUpperCase() || '??'}
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
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border
                      ${item.status === 'hadir' ? 'bg-green-400/20 dark:bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}
                    `}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-700 dark:text-white/70">Wajah (AI)</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none px-3 py-1.5 rounded-full border border-slate-900/10 dark:border-white/10 w-max group-hover:bg-green-400/20 dark:bg-green-500/10 group-hover:border-green-500/30 group-hover:text-green-400 transition-colors">
                       <Smile className="w-4 h-4" />
                       <span className="text-xs font-semibold">Terdeteksi</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-5 bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border-t border-slate-900/10 dark:border-white/10 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-700 dark:text-white/40">Menampilkan 20 entri terakhir</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-full border border-slate-900/10 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-white/70 hover:bg-white/90 dark:bg-white/10 shadow-xl dark:shadow-none hover:text-slate-900 dark:text-white transition-all">Sebelumnya</button>
            <button className="px-4 py-2 rounded-full border border-slate-900/10 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-white/70 hover:bg-white/90 dark:bg-white/10 shadow-xl dark:shadow-none hover:text-slate-900 dark:text-white transition-all">Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
}
