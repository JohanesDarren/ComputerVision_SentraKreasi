import { useState, useEffect } from 'react';
import { Users, AlertCircle, CalendarClock, Settings, UserPlus, Server } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPegawai: 0,
    totalPresensiHariIni: 0,
    aturanAktif: 0
  });
  
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Ambil total pegawai
        const { count: pegawaiCount } = await supabase.from('pegawai').select('*', { count: 'exact', head: true });
        
        // 2. Ambil total presensi hari ini
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count: presensiCount } = await supabase
          .from('presensi')
          .select('*', { count: 'exact', head: true })
          .gte('waktu_hadir', today.toISOString());

        // 3. Ambil aturan aktif
        const { count: aturanCount } = await supabase
          .from('aturan_presensi')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'aktif');

        setStats({
          totalPegawai: pegawaiCount || 0,
          totalPresensiHariIni: presensiCount || 0,
          aturanAktif: aturanCount || 0
        });

        // 4. Ambil aktivitas terkini (5 presensi terakhir)
        const { data: logs } = await supabase
          .from('presensi')
          .select(`
            id,
            waktu_hadir,
            status,
            pegawai (
              nama
            )
          `)
          .order('waktu_hadir', { ascending: false })
          .limit(5);
          
        if (logs) setRecentLogs(logs);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full p-4 md:p-8">
      <div className="mb-4 bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-6">
        <h1 className="font-[Bebas_Neue] text-5xl tracking-wide uppercase text-[#2C2825] dark:text-[#EFEBE1]">Dashboard Administrator</h1>
        <p className="text-[10px] font-bold text-[#6B5A4B] dark:text-[#A89886] uppercase tracking-widest mt-2 border-t-[3px] border-[#2C2825] dark:border-[#EFEBE1] pt-4">Data Real-time terhubung ke Database Supabase.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Pegawai', value: isLoading ? '...' : stats.totalPegawai, icon: Users, color: '#386641', bg: '#EFEBE1', border: '#2C2825' },
          { label: 'Hadir Hari Ini', value: isLoading ? '...' : stats.totalPresensiHariIni, icon: CalendarClock, color: '#2C2825', bg: '#FAF8F5', border: '#2C2825' },
          { label: 'Aturan Aktif', value: isLoading ? '...' : stats.aturanAktif, icon: Settings, color: '#386641', bg: '#FAF8F5', border: '#2C2825' },
          { label: 'Koneksi DB', value: 'OK', icon: Server, color: '#386641', bg: '#EFEBE1', border: '#2C2825' },
        ].map((stat, i) => (
          <div key={i} className={`bg-[${stat.bg}] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-6 flex items-center gap-5 hover:bg-[#EFEBE1] dark:hover:bg-[#1E1C1A] transition-colors group`}>
            <div className={`w-14 h-14 bg-[${stat.bg}] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-6 h-6 text-[${stat.color}] dark:text-[#EFEBE1]`} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#6B5A4B] dark:text-[#A89886] uppercase tracking-widest">{stat.label}</p>
              <h3 className="font-[Bebas_Neue] text-5xl text-[#2C2825] dark:text-[#EFEBE1] leading-none mt-1.5">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pb-6">
        <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-8 transition-colors">
          <div className="flex justify-between items-center mb-6 pb-4 border-b-[3px] border-[#2C2825] dark:border-[#EFEBE1]">
            <h3 className="font-[Bebas_Neue] text-3xl text-[#2C2825] dark:text-[#EFEBE1] uppercase">Aktivitas Presensi Terkini</h3>
            <a href="/admin/history" className="text-[#386641] text-[10px] font-bold tracking-widest uppercase hover:underline">Tampilkan Semua</a>
          </div>
          <div className="space-y-5">
             {isLoading ? (
               <p className="text-sm font-bold animate-pulse text-[#6B5A4B]">Memuat data dari database...</p>
             ) : recentLogs.length === 0 ? (
               <p className="text-sm font-bold text-[#6B5A4B]">Belum ada aktivitas presensi.</p>
             ) : (
               recentLogs.map((log) => (
                 <div key={log.id} className="flex gap-4 items-start border-b-[2px] border-[#2C2825] dark:border-[#1E1C1A] pb-5 last:pb-0 last:border-0">
                    <div className="w-10 h-10 bg-[#386641] flex items-center justify-center border-[2px] border-[#2C2825] dark:border-[#EFEBE1] shrink-0">
                       <CalendarClock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">{log.pegawai?.nama || 'Unknown'}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B5A4B] dark:text-[#A89886] mt-1">Status: {log.status}</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#2C2825] dark:text-[#EFEBE1] bg-[#EFEBE1] dark:bg-[#1E1C1A] px-2 py-1 border-[2px] border-[#2C2825] dark:border-[#EFEBE1]">
                      {format(new Date(log.waktu_hadir), 'HH:mm')}
                    </span>
                 </div>
               ))
             )}
          </div>
        </div>

        <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-8 flex flex-col transition-colors">
          <h3 className="font-[Bebas_Neue] text-3xl text-[#2C2825] dark:text-[#EFEBE1] uppercase mb-4 pb-4 border-b-[3px] border-[#2C2825] dark:border-[#EFEBE1]">Pintasan Database Admin</h3>
          <div className="grid grid-cols-2 gap-4">
            <a href="/admin/pegawai" className="p-4 bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] text-left hover:bg-[#FAF8F5] dark:hover:bg-[#2A2621] transition-colors group">
               <Users className="w-6 h-6 text-[#2C2825] dark:text-[#EFEBE1] mb-3 group-hover:scale-110 transition-transform" />
               <p className="text-sm font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Data Pegawai</p>
               <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B5A4B] dark:text-[#A89886] mt-1">Lihat & Hapus</p>
            </a>
            <a href="/admin/aturan" className="p-4 bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] text-left hover:bg-[#FAF8F5] dark:hover:bg-[#2A2621] transition-colors group">
               <Settings className="w-6 h-6 text-[#2C2825] dark:text-[#EFEBE1] mb-3 group-hover:scale-110 transition-transform" />
               <p className="text-sm font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Aturan Global</p>
               <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B5A4B] dark:text-[#A89886] mt-1">Tabel Aturan DB</p>
            </a>
            <a href="/admin/register" className="p-4 bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] text-left hover:bg-[#386641] dark:hover:bg-[#386641] hover:text-white transition-colors group col-span-2 flex items-center gap-4">
               <UserPlus className="w-6 h-6 text-[#2C2825] dark:text-[#EFEBE1] group-hover:text-white transition-transform" />
               <div>
                 <p className="text-sm font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1] group-hover:text-white">Daftarkan Wajah Baru (Kamera)</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B5A4B] dark:text-[#A89886] mt-1 group-hover:text-white/80">Menambah Data Biometrik ke Database</p>
               </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
