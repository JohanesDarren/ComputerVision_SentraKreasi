import { Users, ScanFace, Settings, TrendingUp, UserCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalPegawai: 0, hadirHariIni: 0, aturanAktif: 0 });
  const [recentPresensi, setRecentPresensi] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const { count: cPegawai } = await supabase.from('pegawai').select('*', { count: 'exact', head: true });
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count: cHadir } = await supabase
          .from('presensi')
          .select('*', { count: 'exact', head: true })
          .in('status', ['masuk', 'hadir'])
          .gte('waktu_hadir', today.toISOString());
          
        const { count: cAturan } = await supabase.from('aturan_presensi').select('*', { count: 'exact', head: true }).eq('is_active', true);
        
        setStats({
          totalPegawai: cPegawai || 0,
          hadirHariIni: cHadir || 0,
          aturanAktif: cAturan || 0
        });

        const { data: recent } = await supabase
          .from('presensi')
          .select('id, waktu_hadir, status, pegawai:pegawai_id (nama, nip)')
          .order('waktu_hadir', { ascending: false })
          .limit(5);

        if (recent) setRecentPresensi(recent);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full p-4 md:p-8 text-slate-900 dark:text-white relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-400/30 dark:bg-green-500/20 rounded-full blur-[150px] pointer-events-none -z-10 mix-blend-screen"></div>

      <div className="bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 p-8 rounded-3xl backdrop-blur-xl">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/60">Admin Overview</h1>
        <p className="text-sm font-medium text-slate-700 dark:text-white/50 mt-2">Pusat kendali dan ringkasan data sistem presensi AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-green-400/20 dark:bg-green-500/10 blur-2xl rounded-full group-hover:bg-green-400/30 dark:bg-green-500/20 transition-all"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/90 dark:bg-white/10 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white/80 group-hover:text-green-400 group-hover:bg-green-400/20 dark:bg-green-500/10 transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest">Total Pegawai</p>
              <h3 className="text-4xl font-bold mt-1">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-700 dark:text-white/50" /> : stats.totalPegawai}
              </h3>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-900/10 dark:border-white/10 relative z-10">
            <p className="text-xs font-medium text-slate-700 dark:text-white/40">Jumlah data akun & biometrik terdaftar.</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/30 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-400/30 dark:bg-green-500/20 blur-3xl rounded-full"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-green-500 text-white dark:text-black dark:text-black flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-white/80 uppercase tracking-widest">Hadir Hari Ini</p>
              <h3 className="text-4xl font-bold mt-1 text-slate-900 dark:text-white">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-700 dark:text-white/50" /> : stats.hadirHariIni}
              </h3>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-900/10 dark:border-white/10 relative z-10">
             <p className="text-xs font-medium text-green-400">Total data kehadiran sukses hari ini.</p>
          </div>
        </div>

        <div className="bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-green-400/20 dark:bg-green-500/10 blur-2xl rounded-full group-hover:bg-green-400/30 dark:bg-green-500/20 transition-all"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/90 dark:bg-white/10 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white/80 group-hover:text-green-400 group-hover:bg-green-400/20 dark:bg-green-500/10 transition-colors">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest">Aturan Aktif</p>
              <h3 className="text-4xl font-bold mt-1">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-700 dark:text-white/50" /> : stats.aturanAktif}
              </h3>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-900/10 dark:border-white/10 relative z-10">
             <p className="text-xs font-medium text-slate-700 dark:text-white/40">Jumlah aturan presensi yang berjalan.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-green-400" /> Presensi Terakhir
            </h3>
          </div>
          <div className="flex-1 space-y-4">
             {isLoading ? (
               <div className="flex justify-center items-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-700 dark:text-white/50" />
               </div>
             ) : recentPresensi.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-10 text-slate-700 dark:text-white/40">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p className="text-sm font-medium">Belum ada presensi hari ini.</p>
               </div>
             ) : recentPresensi.map((item) => (
               <div key={item.id} className="flex items-center justify-between p-4 bg-white/95 dark:bg-black/40 shadow-xl border border-slate-900/5 dark:border-white/5 rounded-2xl">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-green-400/20 dark:bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center font-bold text-sm">
                      {item.pegawai?.nama?.substring(0,2).toUpperCase() || '?'}
                   </div>
                   <div>
                     <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.pegawai?.nama || 'Unknown'}</p>
                     <p className="text-xs text-slate-700 dark:text-white/40 mt-0.5">{item.waktu_hadir ? format(new Date(item.waktu_hadir), 'HH:mm | dd MMM yyyy', {locale: localeID}) : '-'}</p>
                   </div>
                 </div>
                 <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-center
                   ${(item.status === 'masuk' || item.status === 'hadir') ? 'bg-green-400/20 dark:bg-green-500/10 text-green-400 border border-green-500/20' : 
                     item.status === 'pulang' ? 'bg-blue-400/20 dark:bg-blue-500/10 text-blue-500 border border-blue-500/20' : 
                     item.status === 'telat' ? 'bg-orange-400/20 dark:bg-orange-500/10 text-orange-500 border border-orange-500/20' : 
                     'bg-red-500/10 text-red-400 border border-red-500/20'}
                 `}>
                   {item.status}
                 </span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-center items-center text-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent opacity-50"></div>
           <ScanFace className="w-20 h-20 text-slate-900/20 dark:text-slate-300 dark:text-white/20 mb-6 group-hover:text-green-400 transition-colors" />
           <h3 className="text-2xl font-bold mb-2">Monitor AI Biometrik</h3>
           <p className="text-sm text-slate-700 dark:text-white/50 max-w-sm">Sistem sedang memantau dan memproses pemindaian wajah secara real-time untuk seluruh area.</p>
           <button className="mt-8 px-8 py-3 bg-white/90 dark:bg-white/10 shadow-xl dark:shadow-none hover:bg-white dark:hover:bg-white/20 border border-slate-900/10 dark:border-white/10 rounded-full text-sm font-semibold transition-all backdrop-blur-md">
             Cek Log Sistem
           </button>
        </div>
      </div>
    </div>
  );
}
