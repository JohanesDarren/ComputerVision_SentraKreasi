import os

content = """import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Clock, MapPin, CheckCircle, TrendingUp, Sparkles, Smile, BatteryMedium, AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format, subDays, startOfDay } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

export default function Dashboard() {
 const { theme } = useTheme();
 const [pegawai, setPegawai] = useState<any>(null);
 const [stats, setStats] = useState({ totalHadir: 0, timeMasuk: '--:--' });
 const [chartData, setChartData] = useState<any[]>([]);
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  async function loadData() {
   setIsLoading(true);
   try {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;
    
    const { data: pData } = await supabase.from('pegawai').select('*').eq('id', userId).single();
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
      .in('status', ['masuk', 'hadir', 'telat']);
      
     setStats({ 
      totalHadir: count || 0, 
      timeMasuk: prData ? format(new Date(prData.waktu_hadir), 'HH:mm') : '--:--' 
     });

     // Fetch chart data (last 7 days attendance mapping to hours or counts)
     const startDate = subDays(today, 6);
     const { data: historyData } = await supabase
      .from('presensi')
      .select('waktu_hadir, status')
      .eq('pegawai_id', pData.id)
      .gte('waktu_hadir', startDate.toISOString())
      .lte('waktu_hadir', new Date().toISOString());

     if (historyData) {
       const dailyScores: Record<string, number> = {};
       // Initialize 7 days
       for (let i = 6; i >= 0; i--) {
         const d = subDays(today, i);
         dailyScores[format(d, 'dd MMM')] = 0; // 0 means didn't attend
       }
       // If they have any status on that day, make it 1 (or we can calculate actual jam kerja if we want, but binary is simpler for now)
       historyData.forEach((row: any) => {
         const dStr = format(new Date(row.waktu_hadir), 'dd MMM');
         if (['masuk', 'hadir', 'telat'].includes(row.status)) {
           dailyScores[dStr] = 8; // Assuming 8 hours standard work if checked in
         }
       });
       const finalChartData = Object.keys(dailyScores).map(k => ({
         name: k,
         hadir: dailyScores[k]
       }));
       setChartData(finalChartData);
     }
    }
   } catch (err) {
    console.error("Error memuat data dashboard:", err);
   } finally {
    setIsLoading(false);
   }
  }
  loadData();
 }, []);

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
    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 px-5 py-2.5 rounded-full">
      <MapPin className="w-4 h-4 text-green-400" />
      <span className="text-xs font-semibold text-slate-700 dark:text-white/80">Area PAUD Utama</span>
    </div>
   </div>

   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 rounded-3xl p-6 transition-all group">
     <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 shadow-sm dark:shadow-none rounded-2xl border border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:bg-green-400/30 dark:bg-green-500/20 group-hover:text-green-400 group-hover:border-green-500/30 transition-all">
       <Clock className="w-5 h-5 text-slate-700 dark:text-white/80 group-hover:text-green-400" />
      </div>
      <div>
       <p className="text-xs font-medium text-slate-700 dark:text-white/50">Waktu Masuk Hari Ini</p>
       <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">{stats.timeMasuk} <span className="text-sm font-medium text-slate-700 dark:text-white/40">WIB</span></h3>
      </div>
     </div>
     <div className="w-full bg-slate-200 dark:bg-slate-700 shadow-sm dark:shadow-none h-1.5 rounded-full mt-4 overflow-hidden">
      <div className="bg-green-500 h-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" style={{ width: stats.timeMasuk !== '--:--' ? '100%' : '0%' }}></div>
     </div>
     <p className="text-xs font-medium text-green-400 mt-4 flex items-center gap-1.5">
      <CheckCircle className="w-3.5 h-3.5" /> {stats.timeMasuk !== '--:--' ? 'Anda sudah melakukan presensi masuk' : 'Belum presensi masuk'}
     </p>
    </div>

    <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 rounded-3xl p-6 transition-all group relative overflow-hidden">
     <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all"></div>
     <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 shadow-sm dark:shadow-none rounded-2xl border border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:bg-green-400/30 dark:bg-green-500/20 group-hover:text-green-400 group-hover:border-green-500/30 transition-all">
       <TrendingUp className="w-5 h-5 text-slate-700 dark:text-white/80 group-hover:text-green-400" />
      </div>
      <div>
       <p className="text-xs font-medium text-slate-700 dark:text-white/50">Total Kehadiran</p>
       <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">{stats.totalHadir} <span className="text-sm font-medium text-slate-700 dark:text-white/40">Hari</span></h3>
      </div>
     </div>
     <div className="mt-8 flex gap-2">
      <div className="flex-1 bg-slate-200 dark:bg-slate-700 shadow-sm dark:shadow-none rounded-xl p-3 text-center border border-slate-300 dark:border-slate-700">
       <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-white/50 block mb-1">Target</span>
       <span className="text-sm font-bold text-slate-900 dark:text-white">20 Hari</span>
      </div>
      <div className="flex-1 bg-green-400/20 dark:bg-green-500/10 rounded-xl p-3 text-center border border-green-500/20">
       <span className="text-[10px] uppercase font-bold text-green-500 block mb-1">Pencapaian</span>
       <span className="text-sm font-bold text-green-400">{Math.min(100, Math.round((stats.totalHadir / 20) * 100))}%</span>
      </div>
     </div>
    </div>

    <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 rounded-3xl p-6 transition-all group flex flex-col justify-center items-center text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
      <Smile className="w-16 h-16 text-slate-300 dark:text-white/20 mb-4 group-hover:text-green-400 group-hover:scale-110 transition-all duration-300" />
      <h3 className="text-lg font-bold text-slate-900 dark:text-white relative z-10">AI Mood Board</h3>
      <p className="text-xs text-slate-700 dark:text-white/50 mt-2 relative z-10">Berdasarkan pemindaian terakhir, Anda terlihat sangat bersemangat!</p>
    </div>
   </div>

   <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 rounded-3xl p-6 md:p-8 mt-6">
    <div className="flex justify-between items-center mb-8">
     <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
      <BatteryMedium className="w-6 h-6 text-green-400" /> Jam Kerja Historis (7 Hari)
     </h3>
     <div className="flex gap-2">
      <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 shadow-sm dark:shadow-none border border-slate-300 dark:border-slate-700 rounded-full text-xs font-semibold text-slate-900 dark:text-white">Minggu Ini</span>
     </div>
    </div>
    <div className="w-full h-[300px]">
     {isLoading ? (
      <div className="w-full h-full flex justify-center items-center">
       <Loader2 className="w-8 h-8 animate-spin text-green-400" />
      </div>
     ) : (
      <ResponsiveContainer width="100%" height="100%">
       <AreaChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
        <defs>
         <linearGradient id="colorHadir" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={theme === 'dark' ? '#4ade80' : '#22c55e'} stopOpacity={0.4}/>
          <stop offset="95%" stopColor={theme === 'dark' ? '#4ade80' : '#22c55e'} stopOpacity={0}/>
         </linearGradient>
        </defs>
        <XAxis dataKey="name" stroke={theme === 'dark' ? '#ffffff50' : '#0f172a50'} fontSize={12} tickLine={false} axisLine={false} dy={10} />
        <YAxis stroke={theme === 'dark' ? '#ffffff50' : '#0f172a50'} fontSize={12} tickLine={false} axisLine={false} dx={-10} />
        <Tooltip 
         contentStyle={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', borderRadius: '1rem', color: theme === 'dark' ? '#fff' : '#000' }}
         itemStyle={{ color: '#22c55e' }}
        />
        <Area type="monotone" dataKey="hadir" stroke="#22c55e" strokeWidth={4} fillOpacity={1} fill="url(#colorHadir)" />
       </AreaChart>
      </ResponsiveContainer>
     )}
    </div>
   </div>
  </div>
 );
}
"""

with open('src/pages/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
