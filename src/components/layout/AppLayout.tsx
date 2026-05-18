import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ScanFace, History as HistoryIcon, User, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import ThemeToggle from '../ThemeToggle';

const NAV_ITEMS = [
 { label: 'Dashboard', icon: LayoutDashboard, path: '/user' },
 { label: 'Presensi', icon: ScanFace, path: '/user/presensi' },
 { label: 'Riwayat', icon: HistoryIcon, path: '/user/history' },
 { label: 'Profil', icon: User, path: '/user/profile' },
];

export default function AppLayout() {
 const navigate = useNavigate();

 return (
  <div className="relative flex h-screen w-full overflow-hidden bg-gradient-to-br from-[#e8f5e9] via-[#f1f8f5] to-[#e8f5e9] dark:from-[#021208] dark:via-[#0a2e15] dark:to-[#000000] text-slate-900 dark:text-white font-sans selection:bg-green-500 selection:text-slate-900 dark:text-white transition-colors duration-500">
   
   {/* Background Glows */}
   <div className="absolute inset-0 z-0 pointer-events-none">
     <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-400/20 dark:bg-green-500/10 rounded-full blur-[100px] mix-blend-screen"></div>
     <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-400/30 dark:bg-cyan-900/40 rounded-full blur-[120px] mix-blend-screen"></div>
   </div>

   <div className="relative z-10 flex h-screen w-full overflow-hidden">
    {/* Sidebar Desktop */}
    <aside className="hidden md:flex flex-col w-[280px] py-8 px-5 items-center rounded-none bg-slate-100 dark:bg-slate-800 shadow-sm border-r border-slate-300 dark:border-slate-700 h-full justify-between shrink-0 transition-all">
     <div className="flex flex-col items-center gap-8 w-full">
      <div className="flex items-center justify-center">
       <img src="/logo.png" alt="SentraKreasi" className="h-20 w-auto object-contain drop-shadow-sm" />
      </div>
      <nav className="flex flex-col gap-4 mt-6 w-full">
       {NAV_ITEMS.map((item) => (
        <NavLink
         key={item.path}
         to={item.path}
         end={item.path === '/user'}
         className={({ isActive }) =>
          cn(
           "w-full h-12 flex items-center px-4 rounded-2xl transition-all relative group",
           isActive 
            ? "bg-green-500 text-white dark:text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
            : "text-slate-700 dark:text-white/60 hover:text-slate-900 dark:text-white hover:bg-white/10"
          )
         }
         title={item.label}
        >
         <item.icon className="w-5 h-5 shrink-0" />
         <span className="ml-4 font-semibold text-sm">{item.label}</span>
        </NavLink>
       ))}
      </nav>
     </div>

     <div className="flex flex-col gap-6 items-center">
      <ThemeToggle />
      <div className="w-8 h-[1px] bg-white/20 my-1"></div>
      <button 
       onClick={() => {
         if (window.confirm('Apakah Anda yakin ingin keluar?')) {
           navigate('/login');
         }
       }}
       className="w-full h-12 flex items-center px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-sm dark:shadow-none text-slate-700 dark:text-white/60 border border-slate-300 dark:border-slate-700 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all"
       title="Keluar"
      >
       <LogOut className="w-5 h-5 shrink-0" />
       <span className="ml-4 font-semibold text-sm">Keluar</span>
      </button>
     </div>
    </aside>

    {/* Main Content Area */}
    <main className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 mb-6 z-20 shadow-lg">
       <div className="flex items-center gap-3">
        <div className="flex items-center justify-center">
         <img src="/logo.png" alt="SentraKreasi" className="h-12 w-auto object-contain drop-shadow-sm" />
        </div>
       </div>
       <div className="flex items-center gap-3">
        <button onClick={() => navigate('/login')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 shadow-sm dark:shadow-none text-slate-700 dark:text-white/80 border border-slate-300 dark:border-slate-700 hover:bg-red-500/20 hover:text-red-400">
         <LogOut className="w-4 h-4" />
        </button>
       </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:flex items-center justify-between px-8 py-5 bg-white/50 dark:bg-black/20 backdrop-blur-md border-b border-slate-300 dark:border-slate-800 z-20">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Portal Pegawai Sentra Kreasi</h2>
        <div className="flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
          <span>Area Kerja Terpadu</span>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 md:p-10 pb-28 md:pb-10 z-10 custom-scrollbar bg-transparent flex flex-col">
       <Outlet />
       {/* Desktop Footer */}
       <footer className="hidden md:block mt-8 py-4 text-center text-sm text-slate-500 border-t border-slate-300 dark:border-slate-700">
         &copy; {new Date().getFullYear()} Sentra Kreasi. Hak cipta dilindungi.
       </footer>
      </div>
    </main>

    {/* Mobile Navigation */}
    <nav className="md:hidden fixed bottom-6 left-6 right-6 flex items-center justify-around p-3 rounded-full bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 z-30 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
     {NAV_ITEMS.map((item) => (
      <NavLink
       key={item.path}
       to={item.path}
       end={item.path === '/user'}
       className={({ isActive }) =>
        cn(
         "flex flex-col items-center gap-1 p-2 min-w-[60px] rounded-2xl transition-all",
         isActive 
          ? "text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
          : "text-slate-700 dark:text-white/50 hover:text-white"
        )
       }
      >
       <item.icon className="w-6 h-6" />
      </NavLink>
     ))}
    </nav>
   </div>
  </div>
 );
}
