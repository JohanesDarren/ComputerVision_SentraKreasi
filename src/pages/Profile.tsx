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
        // Ambil data pegawai pertama sebagai profil user ini (karena blm ada fitur login multi-user)
        const { data } = await supabase.from('pegawai').select('*').limit(1).single();
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
    
    // Asumsi update profil
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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full p-4 md:p-8">
      <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-6">
        <h1 className="font-[Bebas_Neue] text-5xl tracking-wide uppercase text-[#2C2825] dark:text-[#EFEBE1]">Profil Pengguna</h1>
        <p className="text-[10px] font-bold text-[#6B5A4B] dark:text-[#A89886] uppercase tracking-widest mt-2 border-t-[3px] border-[#2C2825] dark:border-[#EFEBE1] pt-4">Kelola data personal dan biometrik Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6">
        <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] rounded-none p-8 flex flex-col items-center text-center h-max transition-colors">
          <div className="relative mb-6 group cursor-pointer">
            <div className="w-32 h-32 bg-[#EFEBE1] dark:bg-[#151413] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] flex items-center justify-center transition-colors">
              <User className="w-14 h-14 text-[#2C2825] dark:text-[#EFEBE1]" />
            </div>
            <div className="absolute inset-0 bg-[#386641] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white border-[4px] border-[#2C2825] dark:border-[#EFEBE1]">
              <Camera className="w-8 h-8" />
            </div>
          </div>
          <h2 className="font-[Bebas_Neue] text-4xl text-[#2C2825] dark:text-[#EFEBE1] uppercase mt-6">
            {isLoading ? 'Memuat...' : pegawai?.nama || 'Belum Ada Profil'}
          </h2>
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#6B5A4B] dark:text-[#A89886] mt-1">
            {pegawai ? 'Pengguna Sistem' : 'Harap daftarkan wajah dulu'}
          </p>
          <div className={cn("mt-8 px-5 py-3 text-[10px] font-bold uppercase tracking-widest border-[3px] inline-flex items-center justify-center gap-3 w-full transition-colors", pegawai?.embedding ? "bg-[#EFEBE1] dark:bg-[#151413] text-[#386641] border-[#2C2825] dark:border-[#EFEBE1]" : "bg-[#E36D4F] text-white border-[#2C2825]")}>
            {pegawai?.embedding ? (
               <>
                 <div className="w-3 h-3 bg-[#386641] border-[2px] border-[#2C2825] dark:border-[#EFEBE1] animate-pulse" />
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

        <div className="md:col-span-2 bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] overflow-hidden flex flex-col transition-colors">
          <div className="px-8 py-6 border-b-[4px] border-[#2C2825] dark:border-[#EFEBE1] bg-[#EFEBE1] dark:bg-[#151413]">
             <h3 className="font-[Bebas_Neue] text-3xl text-[#2C2825] dark:text-[#EFEBE1] uppercase tracking-wide">Informasi Personal</h3>
          </div>
          
          <form onSubmit={handleSave} className="p-8 space-y-6 flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2C2825] dark:text-[#EFEBE1]" />
                  <input name="nama" type="text" defaultValue={pegawai?.nama || ''} placeholder={isLoading ? "Memuat..." : "Masukkan nama"} className="w-full pl-12 pr-4 py-4 bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] text-sm font-bold uppercase text-[#2C2825] dark:text-[#EFEBE1] focus:outline-none focus:bg-[#FAF8F5] dark:focus:bg-[#1E1C1A] transition-colors" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Nomor Induk / NIP</label>
                <div className="relative">
                  <input type="text" defaultValue={pegawai?.nip || ''} placeholder="-" disabled className="w-full px-5 py-4 bg-[#1E1C1A] dark:bg-black/60 border-[3px] border-[#6B5A4B] text-[#A89886] text-sm font-bold uppercase cursor-not-allowed" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2C2825] dark:text-[#EFEBE1]" />
                  <input type="email" defaultValue="ahmad@sentrakreasi.org" className="w-full pl-12 pr-4 py-4 bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] text-sm font-bold uppercase text-[#2C2825] dark:text-[#EFEBE1] focus:outline-none focus:bg-[#FAF8F5] dark:focus:bg-[#1E1C1A] transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">No. Telepon</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2C2825] dark:text-[#EFEBE1]" />
                  <input type="tel" defaultValue="081234567890" className="w-full pl-12 pr-4 py-4 bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] text-sm font-bold uppercase text-[#2C2825] dark:text-[#EFEBE1] focus:outline-none focus:bg-[#FAF8F5] dark:focus:bg-[#1E1C1A] transition-colors" />
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Alamat</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-5 w-5 h-5 text-[#2C2825] dark:text-[#EFEBE1]" />
                  <textarea rows={3} defaultValue="Jl. Sudirman No. 123, Jakarta Selatan" className="w-full pl-12 pr-4 py-4 bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] text-sm font-bold uppercase text-[#2C2825] dark:text-[#EFEBE1] focus:outline-none focus:bg-[#FAF8F5] dark:focus:bg-[#1E1C1A] transition-colors resize-none" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-8 border-t-[4px] border-[#2C2825] dark:border-[#EFEBE1] mt-auto">
              <button type="button" className="px-8 py-4 border-[3px] border-[#2C2825] dark:border-[#EFEBE1] text-[10px] uppercase font-bold tracking-widest text-[#2C2825] dark:text-[#EFEBE1] bg-[#EFEBE1] dark:bg-[#151413] hover:bg-[#6B5A4B] hover:text-white transition-colors">
                Batal
              </button>
              <button 
                type="submit" 
                disabled={isSaving}
                className={cn(
                  "px-8 py-4 border-[3px] border-[#2C2825] dark:border-[#EFEBE1] text-[10px] uppercase font-bold tracking-widest flex items-center gap-3 transition-colors",
                  isSaved ? "bg-[#386641] text-white" : "bg-[#2C2825] dark:bg-[#EFEBE1] text-white dark:text-[#151413] hover:bg-[#386641] hover:text-white dark:hover:bg-[#386641]",
                  isSaving && "opacity-80 cursor-not-allowed bg-[#EFEBE1] text-[#A89886] dark:bg-[#151413]"
                )}
              >
                {isSaving ? (
                  <span className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                ) : isSaved ? (
                  "Tersimpan"
                ) : (
                  <>
                    <Save className="w-5 h-5" />
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
