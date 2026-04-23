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
    <div className="relative flex h-screen w-full overflow-hidden bg-[#FAF8F5] dark:bg-[#151413] font-sans text-[#2C2825] dark:text-[#EFEBE1] selection:bg-[#386641] selection:text-white transition-colors duration-500">
      <div className="absolute inset-0 z-0 transition-opacity duration-500 pointer-events-none">
         <div className="absolute inset-0 bg-brutalist-grid mix-blend-overlay opacity-60"></div>
      </div>

      <div className="relative z-10 flex h-full w-full p-4 md:p-6 gap-6">
        <aside className="hidden md:flex flex-col w-[80px] py-8 items-center border-[4px] border-[#2C2825] dark:border-[#EFEBE1] rounded-none bg-[#EFEBE1] dark:bg-[#1E1C1A] h-full justify-between shrink-0 transition-colors duration-500">
          <div className="flex flex-col items-center gap-8">
            <div className="w-14 h-14 flex items-center justify-center p-2 bg-[#FAF8F5] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1]">
              <img src="/logo.png" alt="SentraKreasi" className="w-full h-full object-contain" />
            </div>
            <nav className="flex flex-col gap-4 mt-6">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    cn(
                      "w-12 h-12 flex items-center justify-center transition-colors relative group border-[3px]",
                      isActive 
                        ? "bg-[#6B5A4B] text-white border-[#2C2825] dark:border-[#EFEBE1]" 
                        : "text-[#2C2825] dark:text-[#EFEBE1] border-transparent hover:border-[#2C2825] dark:hover:border-[#EFEBE1] hover:bg-[#FAF8F5] dark:hover:bg-[#151413]"
                    )
                  }
                  title={item.label}
                >
                  <item.icon className="w-6 h-6 stroke-[2.5px]" />
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-6 items-center">
            <ThemeToggle />
            <div className="w-12 h-[3px] bg-[#2C2825] dark:bg-[#EFEBE1] my-1"></div>
            <button 
              onClick={() => navigate('/login')}
              className="w-12 h-12 flex items-center justify-center bg-[#E36D4F] text-white border-[3px] border-[#2C2825] dark:border-[#EFEBE1] transition-colors hover:opacity-90"
              title="Keluar"
            >
              <LogOut className="w-5 h-5 stroke-[2.5px]" />
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
           <header className="md:hidden flex items-center justify-between p-4 bg-[#EFEBE1] dark:bg-[#1E1C1A] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] mb-6 z-20 transition-colors">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center p-1.5 bg-[#FAF8F5] dark:bg-[#151413] border-[2px] border-[#2C2825] dark:border-[#EFEBE1]">
                  <img src="/logo.png" alt="SentraKreasi" className="w-full h-full object-contain" />
                </div>
             </div>
             <div className="flex items-center gap-3">
               <ThemeToggle />
               <button onClick={() => navigate('/login')} className="w-10 h-10 flex items-center justify-center bg-[#E36D4F] text-white border-[3px] border-[#2C2825] dark:border-[#EFEBE1] hover:opacity-90 transition-colors">
                  <LogOut className="w-5 h-5 stroke-[2.5px]" />
               </button>
             </div>
           </header>

           <div className="flex-1 overflow-auto pb-28 md:pb-0 z-10 custom-scrollbar border-[4px] md:border-none border-[#2C2825] dark:border-[#EFEBE1] bg-[#FAF8F5] dark:bg-[#151413] md:bg-transparent">
             <Outlet />
           </div>
        </main>

        <nav className="md:hidden fixed bottom-6 left-6 right-6 flex items-center justify-around p-3 bg-[#EFEBE1] dark:bg-[#1E1C1A] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] z-30 transition-colors">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 p-2 min-w-[60px] border-[3px] transition-colors",
                  isActive 
                    ? "bg-[#6B5A4B] text-white border-[#2C2825] dark:border-[#EFEBE1]" 
                    : "text-[#2C2825] dark:text-[#EFEBE1] border-transparent hover:border-[#2C2825] dark:hover:border-[#EFEBE1] hover:bg-[#FAF8F5] dark:hover:bg-[#151413]"
                )
              }
            >
              <item.icon className="w-6 h-6 stroke-[2.5px]" />
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
