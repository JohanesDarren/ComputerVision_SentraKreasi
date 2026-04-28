import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, ArrowRight } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
 const navigate = useNavigate();

 return (
  <div className="relative min-h-screen bg-[#FAF8F5] dark:bg-[#151413] text-[#2C2825] dark:text-[#EFEBE1] font-sans overflow-hidden transition-colors duration-300 flex flex-col items-center justify-center p-6 selection:bg-[#386641] selection:text-white">
   {/* Brutalist Grid Background */}
   <div className="fixed inset-0 z-0 pointer-events-none bg-brutalist-grid opacity-60"></div>
   
   <div className="absolute top-6 right-6 z-20 bg-white/50 dark:bg-white/80 dark:bg-black/50 border border-black/20 dark:border-white/20 p-2">
    <ThemeToggle />
   </div>

   <div className="relative z-10 w-full max-w-md bg-[#EFEBE1] dark:bg-[#1E1C1A] border-[6px] border-[#2C2825] dark:border-[#EFEBE1] transition-all p-8 md:p-10">
    
    <div className="flex flex-col items-center text-center mb-10">
     <img src="/logo.png" alt="SentraKreasi" className="h-20 w-auto object-contain drop-shadow-sm mb-6" />
     <h1 className="font-[Bebas_Neue] text-5xl tracking-wide uppercase mb-2">Akses Sistem</h1>
     <p className="text-sm font-medium text-[#6B5A4B] dark:text-[#A89886]">Pilih peran Anda untuk masuk ke sistem Sentra Kreasi.</p>
    </div>

    <div className="space-y-6">
     <button 
      onClick={() => navigate('/user')}
      className="w-full flex items-center bg-[#FAF8F5] dark:bg-[#2A2621] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] hover:bg-[#EFEBE1] dark:hover:bg-[#151413] transition-colors group text-left relative overflow-hidden"
     >
      <div className="p-6 shrink-0 bg-[#EFEBE1] dark:bg-[#151413] border-r-[3px] border-[#2C2825] dark:border-[#EFEBE1] group-hover:bg-[#386641] group-hover:text-slate-900 dark:text-white transition-colors">
       <User className="w-8 h-8" />
      </div>
      <div className="p-4 flex-1">
       <div className="font-[Bebas_Neue] text-2xl tracking-widest uppercase group-hover:text-[#386641] transition-colors">Pengguna</div>
       <div className="text-[10px] font-bold text-[#6B5A4B] dark:text-[#A89886] uppercase tracking-widest mt-1">Siswa / Pegawai</div>
      </div>
      <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#386641]">
        <ArrowRight className="w-6 h-6" />
      </div>
     </button>

     <button 
      onClick={() => navigate('/admin')}
      className="w-full flex items-center bg-[#FAF8F5] dark:bg-[#2A2621] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] hover:bg-[#EFEBE1] dark:hover:bg-[#151413] transition-colors group text-left relative overflow-hidden"
     >
      <div className="p-6 shrink-0 bg-[#EFEBE1] dark:bg-[#151413] border-r-[3px] border-[#2C2825] dark:border-[#EFEBE1] group-hover:bg-[#2C2825] dark:group-hover:bg-[#EFEBE1] group-hover:text-slate-900 dark:text-white dark:group-hover:text-[#151413] transition-colors">
       <ShieldCheck className="w-8 h-8" />
      </div>
      <div className="p-4 flex-1">
       <div className="font-[Bebas_Neue] text-2xl tracking-widest uppercase transition-colors">Administrator</div>
       <div className="text-[10px] font-bold text-[#6B5A4B] dark:text-[#A89886] uppercase tracking-widest mt-1">Pengaturan Data</div>
      </div>
      <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="w-6 h-6" />
      </div>
     </button>
    </div>
   </div>
  </div>
 );
}
