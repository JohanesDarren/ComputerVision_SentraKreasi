import { Calendar, Search, Filter, Smile, Target, BatteryMedium, Meh, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
const getExpressionIcon = (expr: string) => {
  if (expr === 'Ceria') return <Smile className="w-5 h-5 text-[#2C2825] dark:text-[#EFEBE1]" />;
  if (expr === 'Fokus') return <Target className="w-5 h-5 text-[#2C2825] dark:text-[#EFEBE1]" />;
  if (expr === 'Lelah') return <BatteryMedium className="w-5 h-5 text-[#E36D4F]" />;
  return <Meh className="w-5 h-5 text-[#6B5A4B] dark:text-[#A89886]" />;
};

export default function History() {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('presensi')
        .select(`
          id,
          waktu_hadir,
          status,
          pegawai:pegawai_id (
            nama,
            nip
          )
        `)
        .order('waktu_hadir', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching history:', error);
      } else {
        setHistoryData(data || []);
      }
      setIsLoading(false);
    }

    fetchHistory();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-6 w-full md:w-auto">
          <h1 className="font-[Bebas_Neue] text-5xl tracking-wide uppercase text-[#2C2825] dark:text-[#EFEBE1]">Riwayat Presensi</h1>
          <p className="text-[10px] font-bold text-[#6B5A4B] dark:text-[#A89886] uppercase tracking-widest mt-2 border-t-[3px] border-[#2C2825] dark:border-[#EFEBE1] pt-4">Catatan dan log waktu kehadiran terpadu.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#6B5A4B] dark:text-[#A89886]" />
            <input 
              type="text" 
              placeholder="Cari..." 
              className="pl-12 pr-4 py-4 border-[4px] border-[#2C2825] dark:border-[#EFEBE1] bg-[#EFEBE1] dark:bg-[#151413] text-sm focus:outline-none focus:bg-[#FAF8F5] dark:focus:bg-[#1E1C1A] text-[#2C2825] dark:text-[#EFEBE1] font-bold uppercase tracking-widest placeholder-[#A89886] w-full md:w-48 lg:w-64 transition-all"
            />
          </div>
          <button className="p-4 px-6 border-[4px] border-[#2C2825] dark:border-[#EFEBE1] bg-[#EFEBE1] dark:bg-[#151413] hover:bg-[#386641] hover:text-white dark:hover:bg-[#386641] flex items-center gap-2 text-sm font-[Bebas_Neue] tracking-wider text-[#2C2825] dark:text-[#EFEBE1] transition-colors uppercase">
            <Filter className="w-5 h-5 mb-0.5" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] overflow-hidden flex flex-col transition-colors">
        <div className="p-5 border-b-[4px] border-[#2C2825] dark:border-[#EFEBE1] bg-[#EFEBE1] dark:bg-[#151413]">
           <h3 className="font-[Bebas_Neue] text-2xl text-[#2C2825] dark:text-[#EFEBE1] uppercase tracking-wide">Log Area Pindai</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#EFEBE1] dark:bg-[#1E1C1A] border-b-[4px] border-[#2C2825] dark:border-[#EFEBE1]">
                <th className="py-4 px-6 font-[Bebas_Neue] text-xl text-[#2C2825] dark:text-[#EFEBE1] uppercase tracking-widest">Profil</th>
                <th className="py-4 px-6 font-[Bebas_Neue] text-xl text-[#2C2825] dark:text-[#EFEBE1] uppercase tracking-widest">Waktu</th>
                <th className="py-4 px-6 font-[Bebas_Neue] text-xl text-[#2C2825] dark:text-[#EFEBE1] uppercase tracking-widest">Status</th>
                <th className="py-4 px-6 font-[Bebas_Neue] text-xl text-[#2C2825] dark:text-[#EFEBE1] uppercase tracking-widest">Metode</th>
                <th className="py-4 px-6 font-[Bebas_Neue] text-xl text-[#2C2825] dark:text-[#EFEBE1] uppercase tracking-widest">Ekspresi</th>
              </tr>
            </thead>
            <tbody className="divide-y-[3px] divide-[#2C2825] dark:divide-[#EFEBE1] bg-[#FAF8F5] dark:bg-[#2A2621]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#2C2825] dark:text-[#EFEBE1]">
                    <div className="flex justify-center items-center gap-3 font-[Bebas_Neue] text-2xl tracking-widest uppercase">
                      <Loader2 className="w-8 h-8 animate-spin text-[#386641]" />
                      Memuat Data...
                    </div>
                  </td>
                </tr>
              ) : historyData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#2C2825] dark:text-[#EFEBE1]">
                    <div className="font-[Bebas_Neue] text-2xl tracking-widest uppercase text-[#6B5A4B] dark:text-[#A89886]">Belum ada riwayat presensi</div>
                  </td>
                </tr>
              ) : historyData.map((item) => (
                <tr key={item.id} className="hover:bg-[#EFEBE1] dark:hover:bg-[#151413] transition-colors">
                  <td className="py-4 px-6 flex items-center gap-4">
                    <div className={`w-12 h-12 flex items-center justify-center font-[Bebas_Neue] text-xl bg-[#386641] text-white border-[2px] border-[#2C2825] dark:border-[#EFEBE1]`}>
                       {item.pegawai?.nama?.substring(0, 2).toUpperCase() || '??'}
                    </div>
                    <div>
                       <p className="text-sm font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">{item.pegawai?.nama || 'Unknown'}</p>
                       <p className="text-[10px] uppercase font-bold text-[#6B5A4B] dark:text-[#A89886] mt-1">{item.pegawai?.nip || '-'}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-l-[3px] border-[#2C2825] dark:border-[#EFEBE1]">
                    <div className="font-[Bebas_Neue] text-2xl text-[#2C2825] dark:text-[#EFEBE1]">
                      {item.waktu_hadir ? format(new Date(item.waktu_hadir), 'HH:mm') : '-'}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#6B5A4B] dark:text-[#A89886] mt-1">
                       <Calendar className="w-3 h-3" />
                       {item.waktu_hadir ? format(new Date(item.waktu_hadir), 'dd MMM yyyy', { locale: localeID }) : '-'}
                    </div>
                  </td>
                  <td className="py-4 px-6 border-l-[3px] border-[#2C2825] dark:border-[#EFEBE1]">
                    <span className={`inline-flex items-center px-4 py-2 text-[10px] tracking-widest uppercase font-bold border-[2px] border-[#2C2825] dark:border-[#EFEBE1]
                      ${item.status === 'hadir' ? 'bg-[#386641] text-white' : 'bg-[#E36D4F] text-white'}
                    `}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs uppercase font-bold text-[#2C2825] dark:text-[#EFEBE1] border-l-[3px] border-[#2C2825] dark:border-[#EFEBE1]">Wajah (AI)</td>
                  <td className="py-4 px-6 border-l-[3px] border-[#2C2825] dark:border-[#EFEBE1]">
                    <div className="flex items-center gap-3 bg-[#EFEBE1] dark:bg-[#151413] px-3 py-2 border-[2px] border-[#2C2825] dark:border-[#EFEBE1] w-max">
                       <Smile className="w-5 h-5 text-[#2C2825] dark:text-[#EFEBE1]" />
                       <span className="text-[10px] uppercase font-bold tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Terdeteksi</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-5 bg-[#EFEBE1] dark:bg-[#1E1C1A] border-t-[4px] border-[#2C2825] dark:border-[#EFEBE1] flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B5A4B] dark:text-[#A89886]">Menampilkan 5 entri terakhir</span>
          <div className="flex gap-4">
            <button className="px-5 py-3 border-[3px] border-[#2C2825] dark:border-[#EFEBE1] text-[10px] uppercase font-bold text-[#2C2825] dark:text-[#EFEBE1] hover:bg-[#386641] hover:text-white transition-colors bg-[#FAF8F5] dark:bg-[#2A2621]">Sebelumnya</button>
            <button className="px-5 py-3 border-[3px] border-[#2C2825] dark:border-[#EFEBE1] text-[10px] uppercase font-bold text-[#2C2825] dark:text-[#EFEBE1] hover:bg-[#386641] hover:text-white transition-colors bg-[#FAF8F5] dark:bg-[#2A2621]">Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
}
