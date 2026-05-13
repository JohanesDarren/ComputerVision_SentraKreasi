import { Sliders } from 'lucide-react';

export default function AdminSettings() {
 return (
  <div className="w-full max-w-none mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full p-4 md:p-8 text-slate-900 dark:text-white relative">
   <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 p-8 rounded-3xl w-full relative overflow-hidden">
     <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/60">Settings Sistem</h1>
     <p className="text-sm font-medium text-slate-700 dark:text-white/50 mt-2">Konfigurasi preferensi administrator dan pengaturan lanjutan.</p>
    </div>
   </div>
   <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 p-8 rounded-3xl flex items-center justify-center min-h-[300px]">
     <div className="text-center">
       <Sliders className="w-12 h-12 text-slate-400 mx-auto mb-4" />
       <p className="text-slate-500 font-semibold">Modul Settings Sedang Dalam Pengembangan.</p>
     </div>
   </div>
  </div>
 );
}
