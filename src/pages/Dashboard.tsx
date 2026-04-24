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
        // Ambil pegawai pertama sebagai user aktif (karena belum ada sistem login)
        const { data: pData } = await supabase.from('pegawai').select('*').limit(1).single();
        if (pData) {
          setPegawai(pData);
          
          // Ambil presensi hari ini untuk pegawai tersebut
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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full p-4 md:p-8 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-[Bebas_Neue] text-5xl md:text-6xl tracking-wide uppercase text-[#2C2825] dark:text-[#EFEBE1]">
            {isLoading ? 'Memuat...' : pegawai ? `Selamat Datang, ${pegawai.nama.split(' ')[0]}` : 'Selamat Datang'}
          </h1>
          <p className="text-sm font-bold text-[#6B5A4B] dark:text-[#A89886] uppercase tracking-widest mt-1">
            {pegawai ? `NIP: ${pegawai.nip} | Sistem Siap.` : 'Belum ada data pegawai.'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#EFEBE1] dark:bg-[#1E1C1A] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] px-4 py-3">
           <MapPin className="w-5 h-5 text-[#386641]" />
           <span className="text-xs font-bold text-[#386641] uppercase tracking-widest">Area PAUD Utama</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-6 transition-colors hover:bg-[#EFEBE1] dark:hover:bg-[#1E1C1A] group">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] flex items-center justify-center shrink-0 group-hover:bg-[#386641] group-hover:text-white transition-colors">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#6B5A4B] dark:text-[#A89886] uppercase tracking-widest">Waktu Masuk Hari Ini</p>
              <h3 className="font-[Bebas_Neue] text-4xl text-[#2C2825] dark:text-[#EFEBE1] leading-none mt-1">{stats.timeMasuk} <span className="text-lg">WIB</span></h3>
            </div>
          </div>
          <div className="w-full bg-[#EFEBE1] dark:bg-[#151413] h-3 border-[2px] border-[#2C2825] dark:border-[#EFEBE1] mt-6 relative overflow-hidden">
            <div className="bg-[#386641] h-full absolute left-0 top-0 border-r-[2px] border-[#2C2825] dark:border-[#EFEBE1]" style={{ width: '100%' }}></div>
          </div>
          <p className="text-[10px] font-bold text-[#386641] uppercase tracking-widest mt-3 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> Tepat waktu (Grace period 15m)
          </p>
        </div>

        <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-6 transition-colors hover:bg-[#EFEBE1] dark:hover:bg-[#1E1C1A] group">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] flex items-center justify-center shrink-0 group-hover:bg-[#386641] group-hover:text-white transition-colors">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#6B5A4B] dark:text-[#A89886] uppercase tracking-widest">Total Kehadiran</p>
              <h3 className="font-[Bebas_Neue] text-5xl text-[#2C2825] dark:text-[#EFEBE1] leading-none mt-1">{stats.totalHadir} <span className="text-xl">Hari</span></h3>
            </div>
          </div>
          <p className="text-[10px] font-bold text-[#6B5A4B] dark:text-[#A89886] uppercase tracking-widest mt-6 border-t-[3px] border-[#2C2825] dark:border-[#EFEBE1] pt-4">Berdasarkan data di database (real-time).</p>
        </div>

        <div className="bg-[#386641] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-6 relative overflow-hidden group">
          {/* Internal Brutalist grid for dark green Box */}
          <div className="absolute inset-0 bg-brutalist-grid mix-blend-multiply opacity-40 pointer-events-none"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-white border-[3px] border-[#2C2825] flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#2C2825]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#FAF8F5] uppercase tracking-widest">Performa Wajah</p>
              <h3 className="font-[Bebas_Neue] text-4xl text-white leading-none mt-1">Optimal</h3>
            </div>
          </div>
          <p className="text-[10px] font-bold text-[#FAF8F5] uppercase tracking-widest mt-6 relative z-10 border-t-[3px] border-[#2C2825] pt-4 opacity-90">
            Deteksi selalu berhasil dalam &lt; 2 detik.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6 mt-6">
        <div className="lg:col-span-2 bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-6">
          <div className="flex justify-between items-center mb-6 border-b-[3px] border-[#2C2825] dark:border-[#EFEBE1] pb-4">
            <h3 className="font-[Bebas_Neue] text-3xl text-[#2C2825] dark:text-[#EFEBE1] uppercase">Statistik Kehadiran (Jam)</h3>
            <select className="bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] text-[#2C2825] dark:text-[#EFEBE1] text-[10px] font-bold tracking-widest uppercase px-4 py-2 appearance-none cursor-pointer hover:bg-[#386641] hover:text-white hover:border-[#386641] transition-colors outline-none">
               <option>Minggu Ini</option>
               <option>Bulan Ini</option>
            </select>
          </div>
          <div className="h-72 mt-4 font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyData}>
                <defs>
                  <linearGradient id="colorHadir" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#386641" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#386641" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#EFEBE1' : '#2C2825'} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={theme === 'dark' ? '#EFEBE1' : '#2C2825'} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1E1C1A' : '#FAF8F5', 
                    border: theme === 'dark' ? '3px solid #EFEBE1' : '3px solid #2C2825', 
                    borderRadius: '0', 
                    color: theme === 'dark' ? '#EFEBE1' : '#2C2825', 
                    boxShadow: theme === 'dark' ? '4px 4px 0px #EFEBE1' : '4px 4px 0px #2C2825' 
                  }} 
                  itemStyle={{ color: '#386641', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="hadir" stroke="#2C2825" strokeWidth={3} fillOpacity={1} fill="url(#colorHadir)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-6 flex flex-col">
          <h3 className="font-[Bebas_Neue] text-3xl text-[#2C2825] dark:text-[#EFEBE1] uppercase mb-6 border-b-[3px] border-[#2C2825] dark:border-[#EFEBE1] pb-4">Rekap Ekspresi</h3>
          <div className="space-y-6 flex-1">
             <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                   <div className="flex items-center gap-3 text-[#2C2825] dark:text-[#EFEBE1]">
                      <div className="w-8 h-8 bg-[#EFEBE1] dark:bg-[#151413] flex items-center justify-center border-[2px] border-[#2C2825] dark:border-[#EFEBE1]">
                        <Smile className="w-5 h-5" />
                      </div>
                      Ceria
                   </div>
                   <span className="text-[#386641] self-center text-sm">70%</span>
                </div>
                <div className="w-full bg-[#EFEBE1] dark:bg-[#151413] h-3 border-[2px] border-[#2C2825] dark:border-[#EFEBE1] relative">
                   <div className="bg-[#386641] h-full absolute left-0 top-0 border-r-[2px] border-[#2C2825] dark:border-[#EFEBE1]" style={{width: '70%'}}></div>
                </div>
             </div>

             <div className="space-y-2 mt-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                   <div className="flex items-center gap-3 text-[#2C2825] dark:text-[#EFEBE1]">
                      <div className="w-8 h-8 bg-[#EFEBE1] dark:bg-[#151413] flex items-center justify-center border-[2px] border-[#2C2825] dark:border-[#EFEBE1]">
                        <BatteryMedium className="w-5 h-5" /> 
                      </div>
                      Lelah
                   </div>
                   <span className="text-[#E36D4F] self-center text-sm">20%</span>
                </div>
                <div className="w-full bg-[#EFEBE1] dark:bg-[#151413] h-3 border-[2px] border-[#2C2825] dark:border-[#EFEBE1] relative">
                   <div className="bg-[#E36D4F] h-full absolute left-0 top-0 border-r-[2px] border-[#2C2825] dark:border-[#EFEBE1]" style={{width: '20%'}}></div>
                </div>
             </div>
             
             <div className="p-4 bg-[#EFEBE1] dark:bg-[#1E1C1A] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] mt-auto">
               <p className="text-[10px] font-bold text-[#6B5A4B] dark:text-[#A89886] uppercase tracking-widest leading-relaxed">
                 Sistem AI mendeteksi energimu umumnya positif. Pertahankan!
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
