import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Clock, MapPin, CheckCircle, TrendingUp, Sparkles, Smile, BatteryMedium, AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format, startOfMonth, endOfMonth, getDaysInMonth, setMonth, setYear } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

export default function Dashboard() {
 const { theme } = useTheme();
 const [pegawai, setPegawai] = useState<any>(null);
 const [stats, setStats] = useState({ totalHadir: 0, timeMasuk: '--:--', totalTelat: 0 });
 const [chartData, setChartData] = useState<any[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 
 const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
 const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

 useEffect(() => {
  async function loadData() {
   setIsLoading(true);
   try {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;
    
    const { data: pData } = await supabase.from('pegawai').select('*').eq('id', userId).single();
    if (!pData) return;
    setPegawai(pData);
    
    // 1. Waktu Masuk Hari Ini
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

    // Set filter dates based on selectedMonth/Year
    let filterDate = new Date();
    filterDate = setYear(filterDate, selectedYear);
    filterDate = setMonth(filterDate, selectedMonth);
    const startM = startOfMonth(filterDate);
    const endM = endOfMonth(filterDate);

    // 2. Data presensi pada bulan yang dipilih
    const { data: historyData } = await supabase
     .from('presensi')
     .select('waktu_hadir, status')
     .eq('pegawai_id', pData.id)
     .gte('waktu_hadir', startM.toISOString())
     .lte('waktu_hadir', endM.toISOString())
     .order('waktu_hadir', { ascending: true });

    let countHadir = 0;
    let countTelat = 0;
    
    const daysInMonth = getDaysInMonth(filterDate);
    const chartMap: Record<number, any> = {};
    for (let i = 1; i <= daysInMonth; i++) {
     chartMap[i] = { date: i, masuk: null, pulang: null };
    }

    if (historyData) {
      historyData.forEach((row: any) => {
        const d = new Date(row.waktu_hadir);
        const day = d.getDate();
        const decimalHour = d.getHours() + (d.getMinutes() / 60);

        if (['masuk', 'hadir'].includes(row.status)) {
          countHadir++;
          if (!chartMap[day].masuk) chartMap[day].masuk = decimalHour;
        } else if (row.status === 'telat') {
          countHadir++;
          countTelat++;
          if (!chartMap[day].masuk) chartMap[day].masuk = decimalHour;
        } else if (row.status === 'pulang') {
          chartMap[day].pulang = decimalHour;
        }
      });
    }
    
    setStats({ 
     totalHadir: countHadir, 
     timeMasuk: prData ? format(new Date(prData.waktu_hadir), 'HH:mm') : '--:--',
     totalTelat: countTelat
    });

    setChartData(Object.values(chartMap));
    
   } catch (err) {
    console.error("Error memuat data dashboard:", err);
   } finally {
    setIsLoading(false);
   }
  }
  loadData();
 }, [selectedMonth, selectedYear]);

 const formatHourTooltip = (val: number) => {
   if (val === null || val === undefined) return '-';
   const h = Math.floor(val);
   const m = Math.round((val - h) * 60);
   return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
 };

 return (
  <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900 dark:text-white relative">
   <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
    <div>
     <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/60 pb-1">
      {isLoading ? 'Memuat...' : pegawai ? `Selamat Datang, ${pegawai.nama.split(' ')[0]}` : 'Selamat Datang'}
     </h1>
     <p className="text-xs font-medium text-slate-700 dark:text-white/50 mt-1">
      {pegawai ? `NIP: ${pegawai.nip} | Sistem Siap.` : 'Belum ada data pegawai.'}
     </p>
    </div>
    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 px-4 py-1.5 rounded-full">
      <MapPin className="w-3.5 h-3.5 text-green-400" />
      <span className="text-[10px] font-semibold text-slate-700 dark:text-white/80">Area PAUD Utama</span>
    </div>
   </div>

   {/* Filter Bulan dan Tahun */}
   <div className="flex gap-3 items-center justify-end">
    <select 
     value={selectedMonth} 
     onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
     className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none focus:border-green-500 transition-colors"
    >
     {Array.from({length: 12}).map((_, i) => (
      <option key={i} value={i}>{format(setMonth(new Date(), i), 'MMMM', {locale: localeID})}</option>
     ))}
    </select>
    <select 
     value={selectedYear} 
     onChange={(e) => setSelectedYear(parseInt(e.target.value))}
     className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none focus:border-green-500 transition-colors"
    >
     {[new Date().getFullYear(), new Date().getFullYear() - 1].map(y => (
      <option key={y} value={y}>{y}</option>
     ))}
    </select>
   </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
     {/* Kartu Waktu Masuk Hari Ini */}
     <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 rounded-2xl p-4 transition-all group">
      <div className="flex items-center gap-3 mb-3">
       <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 shadow-sm dark:shadow-none rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:bg-green-400/30 dark:bg-green-500/20 group-hover:text-green-400 group-hover:border-green-500/30 transition-all">
        <Clock className="w-4 h-4 text-slate-700 dark:text-white/80 group-hover:text-green-400" />
       </div>
       <div>
        <p className="text-[10px] font-medium text-slate-700 dark:text-white/50">Waktu Masuk Hari Ini</p>
        <h3 className="text-xl font-bold mt-0.5 text-slate-900 dark:text-white">{stats.timeMasuk} <span className="text-xs font-medium text-slate-700 dark:text-white/40">WIB</span></h3>
       </div>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 shadow-sm dark:shadow-none h-1 rounded-full mt-3 overflow-hidden">
       <div className="bg-green-500 h-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" style={{ width: stats.timeMasuk !== '--:--' ? '100%' : '0%' }}></div>
      </div>
      <p className="text-[10px] font-medium text-green-400 mt-3 flex items-center gap-1">
       <CheckCircle className="w-3 h-3" /> {stats.timeMasuk !== '--:--' ? 'Anda sudah presensi masuk' : 'Belum presensi masuk'}
      </p>
     </div>

     {/* Kartu Total Kehadiran Bulan Ini */}
     <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 rounded-2xl p-4 transition-all group relative overflow-hidden">
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all"></div>
      <div className="flex items-center gap-3 mb-3">
       <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 shadow-sm dark:shadow-none rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:bg-green-400/30 dark:bg-green-500/20 group-hover:text-green-400 group-hover:border-green-500/30 transition-all">
        <TrendingUp className="w-4 h-4 text-slate-700 dark:text-white/80 group-hover:text-green-400" />
       </div>
       <div>
        <p className="text-[10px] font-medium text-slate-700 dark:text-white/50">Total Hadir (Bulan Ini)</p>
        <h3 className="text-xl font-bold mt-0.5 text-slate-900 dark:text-white">{stats.totalHadir} <span className="text-xs font-medium text-slate-700 dark:text-white/40">Hari</span></h3>
       </div>
      </div>
      <div className="mt-3 flex gap-2">
       <div className="flex-1 bg-slate-200 dark:bg-slate-700 shadow-sm dark:shadow-none rounded-lg p-2 text-center border border-slate-300 dark:border-slate-700">
        <span className="text-[9px] uppercase font-bold text-slate-700 dark:text-white/50 block mb-0.5">Target</span>
        <span className="text-xs font-bold text-slate-900 dark:text-white">20 Hari</span>
       </div>
       <div className="flex-1 bg-green-400/20 dark:bg-green-500/10 rounded-lg p-2 text-center border border-green-500/20">
        <span className="text-[9px] uppercase font-bold text-green-500 block mb-0.5">Pencapaian</span>
        <span className="text-xs font-bold text-green-400">{Math.min(100, Math.round((stats.totalHadir / 20) * 100))}%</span>
       </div>
      </div>
     </div>

     {/* Kartu Total Telat Bulan Ini */}
     <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 rounded-2xl p-4 transition-all group relative overflow-hidden flex flex-col justify-between">
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
      <div className="flex items-center gap-3 mb-2">
       <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 shadow-sm dark:shadow-none rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:bg-orange-400/30 dark:bg-orange-500/20 group-hover:text-orange-400 group-hover:border-orange-500/30 transition-all">
        <AlertCircle className="w-4 h-4 text-slate-700 dark:text-white/80 group-hover:text-orange-400" />
       </div>
       <div>
        <p className="text-[10px] font-medium text-slate-700 dark:text-white/50">Total Telat (Bulan Ini)</p>
        <h3 className="text-xl font-bold mt-0.5 text-slate-900 dark:text-white">{stats.totalTelat} <span className="text-xs font-medium text-slate-700 dark:text-white/40">Hari</span></h3>
       </div>
      </div>
      <div className="mt-2 text-left">
       <p className="text-[10px] font-semibold text-slate-700 dark:text-white/50">
         {stats.totalTelat === 0 ? "Hebat! Anda tidak pernah telat." : "Harap perhatikan jam masuk Anda."}
       </p>
      </div>
     </div>
    </div>

   {/* Grafik Historis */}
   <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 rounded-2xl p-4 md:p-5 mt-4">
    <div className="flex justify-between items-center mb-4">
     <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
      <BatteryMedium className="w-4.5 h-4.5 text-green-400" /> Jam Presensi Harian
     </h3>
     <div className="flex gap-2">
      <span className="px-2.5 py-0.5 bg-slate-200 dark:bg-slate-700 shadow-sm dark:shadow-none border border-slate-300 dark:border-slate-700 rounded-full text-[10px] font-semibold text-slate-900 dark:text-white">
        Bulan {format(setMonth(new Date(), selectedMonth), 'MMM', {locale: localeID})}
      </span>
     </div>
    </div>
    <div className="w-full h-[220px]">
     {isLoading ? (
      <div className="w-full h-full flex justify-center items-center">
       <Loader2 className="w-6 h-6 animate-spin text-green-400" />
      </div>
     ) : (
      <ResponsiveContainer width="100%" height="100%">
       <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#ffffff10' : '#00000010'} vertical={false} />
        <XAxis dataKey="date" stroke={theme === 'dark' ? '#ffffff50' : '#0f172a50'} fontSize={10} tickLine={false} axisLine={false} dy={5} />
        <YAxis 
          domain={[0, 24]} 
          ticks={[0, 6, 12, 18, 24]} 
          tickFormatter={(val) => `${val}:00`} 
          stroke={theme === 'dark' ? '#ffffff50' : '#0f172a50'} 
          fontSize={10} 
          tickLine={false} 
          axisLine={false} 
          dx={-5} 
        />
        <Tooltip 
         contentStyle={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', borderRadius: '0.75rem', color: theme === 'dark' ? '#fff' : '#000', fontSize: '11px' }}
         formatter={(value: any, name: string) => [formatHourTooltip(value as number), name]}
         labelFormatter={(label) => `Tanggal ${label}`}
        />
        <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
        <Line type="monotone" dataKey="masuk" name="Jam Masuk" stroke="#4ade80" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1.5 }} activeDot={{ r: 5 }} connectNulls />
        <Line type="monotone" dataKey="pulang" name="Jam Pulang" stroke="#60a5fa" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1.5 }} activeDot={{ r: 5 }} connectNulls />
       </LineChart>
      </ResponsiveContainer>
     )}
    </div>
   </div>
  </div>
 );
}
