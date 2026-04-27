import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Clock, MapPin, CheckCircle, TrendingUp, Sparkles, Smile, BatteryMedium } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

export default function Dashboard() {
  const { theme } = useTheme();
  const [pegawai, setPegawai] = useState<any>(null);
  const [stats, setStats] = useState({ totalHadir: 0, timeMasuk: '--:--' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const { data: pData } = await supabase.from('pegawai').select('*').limit(1).single();
        if (pData) {
          setPegawai(pData);
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const { data: prData } = await supabase
            .from('presensi')
            .select('waktu_hadir')
            .eq('pegawai_id', pData.id)
            .gte('waktu_hadir', today.toISOString())
            .order('waktu_hadir', { ascending: true })
            .limit(1)
            .single();

          const { count } = await supabase
            .from('presensi')
            .select('*', { count: 'exact', head: true })
            .eq('pegawai_id', pData.id)
            .eq('status', 'hadir');
            
          setStats({ 
            totalHadir: count || 0, 
            timeMasuk: prData ? format(new Date(prData.waktu_hadir), 'HH:mm') : '--:--' 
          });
        }
      } catch (err) {
        console.error("Error memuat data dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const dummyData = [
    { name: 'Sen', hadir: 8 },
    { name: 'Sel', hadir: 7.5 },
    { name: 'Rab', hadir: 8 },
    { name: 'Kam', hadir: 8.5 },
    { name: 'Jum', hadir: 7 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full p-4 md:p-8 relative text-slate-900 dark:text-white">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/60">
            {isLoading ? 'Memuat...' : pegawai ? `Selamat Datang, ${pegawai.nama.split(' ')[0]}` : 'Selamat Datang'}
          </h1>
          <p className="text-sm font-medium text-slate-700 dark:text-white/50 mt-2">
            {pegawai ? `NIP: ${pegawai.nip} | Sistem Siap.` : 'Belum ada data pegawai.'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 backdrop-blur-md px-5 py-2.5 rounded-full">
           <MapPin className="w-4 h-4 text-green-400" />
           <span className="text-xs font-semibold text-slate-700 dark:text-white/80">Area PAUD Utama</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:bg-white dark:hover:bg-white dark:hover:bg-white/10 transition-all group">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white/90 dark:bg-white/10 shadow-xl dark:shadow-none rounded-2xl border border-slate-900/10 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:bg-green-400/30 dark:bg-green-500/20 group-hover:text-green-400 group-hover:border-green-500/30 transition-all">
              <Clock className="w-5 h-5 text-slate-700 dark:text-white/80 group-hover:text-green-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-700 dark:text-white/50">Waktu Masuk Hari Ini</p>
              <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">{stats.timeMasuk} <span className="text-sm font-medium text-slate-700 dark:text-white/40">WIB</span></h3>
            </div>
          </div>
          <div className="w-full bg-white/90 dark:bg-white/10 shadow-xl dark:shadow-none h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-green-500 h-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" style={{ width: '100%' }}></div>
          </div>
          <p className="text-xs font-medium text-green-400 mt-4 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Tepat waktu (Grace period 15m)
          </p>
        </div>

        <div className="bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:bg-white dark:hover:bg-white dark:hover:bg-white/10 transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/90 dark:bg-white/10 shadow-xl dark:shadow-none rounded-2xl border border-slate-900/10 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:bg-green-400/30 dark:bg-green-500/20 group-hover:text-green-400 group-hover:border-green-500/30 transition-all">
              <TrendingUp className="w-5 h-5 text-slate-700 dark:text-white/80 group-hover:text-green-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-700 dark:text-white/50">Total Kehadiran</p>
              <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">{stats.totalHadir} <span className="text-sm font-medium text-slate-700 dark:text-white/40">Hari</span></h3>
            </div>
          </div>
          <p className="text-xs font-medium text-slate-700 dark:text-white/40 mt-8 border-t border-slate-900/10 dark:border-white/10 pt-4">Berdasarkan data di database (real-time).</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/30 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/30 dark:bg-green-500/20 blur-3xl rounded-full"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-green-500 text-white dark:text-black dark:text-black rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-700 dark:text-white/80">Performa Wajah</p>
              <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">Optimal</h3>
            </div>
          </div>
          <p className="text-xs font-medium text-slate-700 dark:text-white/60 mt-8 relative z-10 border-t border-slate-900/10 dark:border-white/10 pt-4">
            Deteksi selalu berhasil dalam &lt; 2 detik.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6 mt-6">
        <div className="lg:col-span-2 bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6 border-b border-slate-900/10 dark:border-white/10 pb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Statistik Kehadiran (Jam)</h3>
            <select className="bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 text-slate-900 dark:text-white text-xs font-medium px-4 py-2 rounded-full appearance-none cursor-pointer focus:outline-none focus:border-green-500/50">
               <option className="bg-white dark:bg-black text-slate-900 dark:text-white">Minggu Ini</option>
               <option className="bg-white dark:bg-black text-slate-900 dark:text-white">Bulan Ini</option>
            </select>
          </div>
          <div className="h-72 mt-4 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyData}>
                <defs>
                  <linearGradient id="colorHadir" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(3, 7, 18, 0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px', 
                    color: '#fff',
                    backdropFilter: 'blur(10px)'
                  }} 
                  itemStyle={{ color: '#4ade80', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="hadir" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorHadir)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 border-b border-slate-900/10 dark:border-white/10 pb-4">Rekap Ekspresi</h3>
          <div className="space-y-6 flex-1">
             <div className="space-y-3">
                <div className="flex justify-between text-xs font-medium">
                   <div className="flex items-center gap-3 text-slate-700 dark:text-white/80">
                      <div className="w-8 h-8 bg-white/90 dark:bg-white/10 shadow-xl dark:shadow-none rounded-xl flex items-center justify-center border border-white/10">
                        <Smile className="w-4 h-4" />
                      </div>
                      Ceria
                   </div>
                   <span className="text-green-400 self-center">70%</span>
                </div>
                <div className="w-full bg-white/90 dark:bg-white/10 shadow-xl dark:shadow-none h-1.5 rounded-full overflow-hidden">
                   <div className="bg-green-500 h-full rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" style={{width: '70%'}}></div>
                </div>
             </div>

             <div className="space-y-3 mt-4">
                <div className="flex justify-between text-xs font-medium">
                   <div className="flex items-center gap-3 text-slate-700 dark:text-white/80">
                      <div className="w-8 h-8 bg-white/90 dark:bg-white/10 shadow-xl dark:shadow-none rounded-xl flex items-center justify-center border border-white/10">
                        <BatteryMedium className="w-4 h-4" /> 
                      </div>
                      Lelah
                   </div>
                   <span className="text-orange-400 self-center">20%</span>
                </div>
                <div className="w-full bg-white/90 dark:bg-white/10 shadow-xl dark:shadow-none h-1.5 rounded-full overflow-hidden">
                   <div className="bg-orange-500 h-full rounded-full" style={{width: '20%'}}></div>
                </div>
             </div>
             
             <div className="p-4 bg-green-400/20 dark:bg-green-500/10 border border-green-500/20 rounded-2xl mt-auto">
               <p className="text-xs font-medium text-green-400 leading-relaxed text-center">
                 Sistem AI mendeteksi energimu umumnya positif. Pertahankan!
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
