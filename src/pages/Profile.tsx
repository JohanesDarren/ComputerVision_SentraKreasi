import { User, Mail, Phone, MapPin, Save, Camera, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [pegawai, setPegawai] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) return;

        const { data } = await supabase.from('pegawai').select('*').eq('id', userId).single();
        if (data) setPegawai(data);
      } catch (err) {
        console.error('Gagal memuat profil:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    if (pegawai) {
       const form = e.target as HTMLFormElement;
       const nama = (form.elements.namedItem('nama') as HTMLInputElement).value;
       
       await supabase.from('pegawai').update({ nama }).eq('id', pegawai.id);
       setPegawai({...pegawai, nama});
    }

    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900 dark:text-white relative">
      
      {/* Background Glows (more prominent) */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-400/30 dark:bg-green-500/20 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen"></div>
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-cyan-400/30 dark:bg-cyan-900/40 rounded-full blur-[150px] pointer-events-none -z-10 mix-blend-screen"></div>

      <div className="bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 p-8 rounded-3xl backdrop-blur-xl">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/60">Profil Pengguna</h1>
        <p className="text-sm font-medium text-slate-700 dark:text-white/50 mt-2">Kelola data personal dan biometrik Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6">
        <div className="bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-3xl p-8 flex flex-col items-center text-center h-max transition-all backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-green-400/30 dark:bg-green-500/20 blur-3xl rounded-t-3xl -z-10"></div>
          
          <div className="relative mb-6 group cursor-pointer">
            <div className="w-32 h-32 rounded-full bg-white dark:bg-black border-4 border-slate-900/10 dark:border-white/10 flex items-center justify-center transition-all overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <User className="w-14 h-14 text-slate-700 dark:text-white/60 group-hover:text-slate-900 dark:text-white transition-colors" />
            </div>
            <div className="absolute inset-0 bg-green-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-slate-900 dark:text-white dark:text-black rounded-full backdrop-blur-sm">
              <Camera className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {isLoading ? 'Memuat...' : pegawai?.nama || 'Belum Ada Profil'}
          </h2>
          <p className="text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest mt-1">
            {pegawai ? 'Pengguna Sistem' : 'Harap daftarkan wajah dulu'}
          </p>
          <div className={cn("mt-8 px-5 py-3 text-xs font-semibold uppercase tracking-widest rounded-full inline-flex items-center justify-center gap-3 w-full transition-all backdrop-blur-md", pegawai?.embedding ? "bg-green-400/20 dark:bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]" : "bg-red-500/10 text-red-400 border border-red-500/20")}>
            {pegawai?.embedding ? (
               <>
                 <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse" />
                 Biometrik Aktif
               </>
            ) : (
               <>
                 <AlertCircle className="w-4 h-4" />
                 Belum Ada Biometrik
               </>
            )}
          </div>
        </div>

        <div className="md:col-span-2 bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col transition-all backdrop-blur-xl relative">
          <div className="px-8 py-6 border-b border-slate-900/10 dark:border-white/10 bg-white/5">
             <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Informasi Personal</h3>
          </div>
          
          <form onSubmit={handleSave} className="p-8 space-y-6 flex-1 flex flex-col relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 dark:text-white/70 block">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 dark:text-white/40" />
                  <input name="nama" type="text" defaultValue={pegawai?.nama || ''} placeholder={isLoading ? "Memuat..." : "Masukkan nama"} className="w-full pl-12 pr-4 py-4 bg-white/95 dark:bg-black/40 shadow-xl border border-slate-900/10 dark:border-white/10 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all placeholder-slate-400 dark:placeholder-white/30" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 dark:text-white/70 block">Nomor Induk / NIP</label>
                <div className="relative">
                  <input type="text" defaultValue={pegawai?.nip || ''} placeholder="-" disabled className="w-full px-5 py-4 bg-white/70 dark:bg-black/60 border border-slate-900/5 dark:border-white/5 rounded-2xl text-slate-700 dark:text-white/40 text-sm font-semibold cursor-not-allowed" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 dark:text-white/70 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 dark:text-white/40" />
                  <input type="email" defaultValue={pegawai?.email || ''} disabled className="w-full pl-12 pr-4 py-4 bg-white/70 dark:bg-black/60 border border-slate-900/5 dark:border-white/5 rounded-2xl text-slate-700 dark:text-white/40 text-sm font-semibold cursor-not-allowed" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 dark:text-white/70 block">No. Telepon</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 dark:text-white/40" />
                  <input type="tel" defaultValue="081234567890" className="w-full pl-12 pr-4 py-4 bg-white/95 dark:bg-black/40 shadow-xl border border-slate-900/10 dark:border-white/10 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all placeholder-slate-400 dark:placeholder-white/30" />
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-medium text-slate-700 dark:text-white/70 block">Alamat</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-5 w-5 h-5 text-slate-700 dark:text-white/40" />
                  <textarea rows={3} defaultValue="Jl. Sudirman No. 123, Jakarta Selatan" className="w-full pl-12 pr-4 py-4 bg-white/95 dark:bg-black/40 shadow-xl border border-slate-900/10 dark:border-white/10 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all resize-none placeholder-slate-400 dark:placeholder-white/30" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-8 border-t border-slate-900/10 dark:border-white/10 mt-auto">
              <button type="button" className="px-8 py-3 rounded-full border border-slate-900/10 dark:border-white/10 text-sm font-semibold text-slate-700 dark:text-white/70 hover:bg-white/90 dark:bg-white/10 shadow-xl dark:shadow-none hover:text-slate-900 dark:text-white transition-all">
                Batal
              </button>
              <button 
                type="submit" 
                disabled={isSaving}
                className={cn(
                  "px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)]",
                  isSaved ? "bg-green-500 text-black" : "bg-green-500 text-white dark:text-black dark:text-black hover:bg-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]",
                  isSaving && "opacity-80 cursor-not-allowed bg-green-500/50"
                )}
              >
                {isSaving ? (
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : isSaved ? (
                  "Tersimpan"
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan Profil
                  </>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
