import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CalendarClock, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function AdminHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('presensi')
        .select(`
          id,
          waktu_hadir,
          status,
          pegawai (
            nama,
            nip
          )
        `)
        .order('waktu_hadir', { ascending: false });
      
      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error("Gagal memuat history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-full space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] rounded-none p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
             <h1 className="font-[Bebas_Neue] text-5xl tracking-wide text-[#2C2825] dark:text-[#EFEBE1] uppercase mb-2">Riwayat Global (Database)</h1>
             <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B5A4B] dark:text-[#A89886] border-t-[3px] border-[#2C2825] dark:border-[#EFEBE1] pt-4">
               Semua aktivitas dan log presensi biometrik yang tercatat di Supabase.
             </p>
          </div>
          <button onClick={fetchHistory} className="p-3 bg-[#EFEBE1] border-[3px] border-[#2C2825] hover:bg-[#2C2825] hover:text-white transition-colors group">
            <RefreshCw className={`w-5 h-5 text-[#2C2825] group-hover:text-white ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto border-[3px] border-[#2C2825] dark:border-[#EFEBE1] bg-white dark:bg-[#151413]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EFEBE1] dark:bg-[#1E1C1A] border-b-[3px] border-[#2C2825] dark:border-[#EFEBE1]">
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Tanggal & Waktu</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Nama Pegawai</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">NIP</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="p-8 text-center text-sm font-bold uppercase tracking-widest animate-pulse">Memuat Data...</td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-sm font-bold uppercase tracking-widest">Belum ada riwayat presensi.</td></tr>
              ) : history.map((log) => (
                <tr key={log.id} className="border-b-[2px] border-[#2C2825] dark:border-[#2A2621] hover:bg-[#FAF8F5] dark:hover:bg-[#2A2621] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#2C2825] flex items-center justify-center border-[2px] border-[#EFEBE1]">
                        <CalendarClock className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold text-[#2C2825] dark:text-[#EFEBE1] uppercase text-sm">
                        {format(new Date(log.waktu_hadir), 'dd MMM yyyy, HH:mm:ss', { locale: id })}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-[#2C2825] dark:text-[#EFEBE1] uppercase">{log.pegawai?.nama || 'Unknown'}</td>
                  <td className="p-4 text-sm font-bold text-[#6B5A4B] dark:text-[#A89886]">{log.pegawai?.nip || '-'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border-[2px] border-[#2C2825] ${log.status === 'hadir' ? 'bg-[#386641] text-white' : 'bg-[#E36D4F] text-white'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
