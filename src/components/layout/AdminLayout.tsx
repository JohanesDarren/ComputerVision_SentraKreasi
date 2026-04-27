import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, History as HistoryIcon, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import ThemeToggle from '../ThemeToggle';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Data Pegawai', icon: Users, path: '/admin/pegawai' },
  { label: 'Aturan Presensi', icon: Settings, path: '/admin/aturan' },
  { label: 'Riwayat', icon: HistoryIcon, path: '/admin/history' },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-gradient-to-br from-[#e8f5e9] via-[#f1f8f5] to-[#ffffff] dark:from-[#021208] dark:via-[#0a2e15] dark:to-[#000000] text-slate-900 dark:text-white font-sans selection:bg-green-500 selection:text-slate-900 dark:text-white transition-colors duration-500">
      
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-400/20 dark:bg-green-500/10 rounded-full blur-[100px] mix-blend-screen"></div>
         <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-400/30 dark:bg-cyan-900/40 rounded-full blur-[120px] mix-blend-screen"></div>
      </div>

      <div className="relative z-10 flex h-full w-full p-4 md:p-6 gap-6">
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex flex-col w-[80px] py-8 items-center rounded-[2rem] bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 backdrop-blur-xl h-full justify-between shrink-0 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col items-center gap-8">
            <div className="w-12 h-12 flex items-center justify-center p-2 rounded-xl bg-white/90 dark:bg-white/10 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 shadow-inner">
              <img src="/logo.png" alt="SentraKreasi" className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] dark:drop-shadow-sm brightness-110 dark:brightness-200" />
            </div>
            <nav className="flex flex-col gap-4 mt-6">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    cn(
                      "w-12 h-12 flex items-center justify-center rounded-2xl transition-all relative group",
                      isActive 
                        ? "bg-green-500 text-white dark:text-black dark:text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
                        : "text-slate-700 dark:text-white/60 hover:text-slate-900 dark:text-white hover:bg-white/10"
                    )
                  }
                  title={item.label}
                >
                  <item.icon className="w-5 h-5" />
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-6 items-center">
            <ThemeToggle />
            <div className="w-8 h-[1px] bg-white/20 my-1"></div>
            <button 
              onClick={() => navigate('/login')}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none text-slate-700 dark:text-white/60 border border-slate-900/10 dark:border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all"
              title="Keluar"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
           {/* Mobile Header */}
           <header className="md:hidden flex items-center justify-between p-4 rounded-2xl bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 backdrop-blur-xl mb-6 z-20 shadow-lg">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center p-1.5 rounded-xl bg-white/90 dark:bg-white/10 shadow-xl dark:shadow-none border border-white/10">
                  <img src="/logo.png" alt="SentraKreasi" className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] dark:drop-shadow-sm brightness-110 dark:brightness-200" />
                </div>
             </div>
             <div className="flex items-center gap-3">
               <button onClick={() => navigate('/login')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none text-slate-700 dark:text-white/80 border border-slate-900/10 dark:border-white/10 hover:bg-red-500/20 hover:text-red-400">
                  <LogOut className="w-4 h-4" />
               </button>
             </div>
           </header>

           <div className="flex-1 overflow-auto pb-28 md:pb-0 z-10 custom-scrollbar rounded-[2rem] bg-transparent">
             <Outlet />
           </div>
        </main>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-6 left-6 right-6 flex items-center justify-around p-3 rounded-full bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 backdrop-blur-xl z-30 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
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
