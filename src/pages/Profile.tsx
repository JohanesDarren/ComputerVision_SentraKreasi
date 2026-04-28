import { User, Mail, Phone, MapPin, Save, Camera, AlertCircle, Upload, X } from 'lucide-react';
import Webcam from 'react-webcam';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

export default function Profile() {
 const [isSaving, setIsSaving] = useState(false);
 const [isSaved, setIsSaved] = useState(false);
 const [pegawai, setPegawai] = useState<any>(null);
 const [isLoading, setIsLoading] = useState(true);
 const [showPhotoModal, setShowPhotoModal] = useState(false);
 const [useCamera, setUseCamera] = useState(false);
 const webcamRef = useRef<Webcam>(null);
 const fileInputRef = useRef<HTMLInputElement>(null);
 const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
 const [localInfo, setLocalInfo] = useState({ telp: '', alamat: '' });

 useEffect(() => {
  if (pegawai) {
   const photo = localStorage.getItem(`profile_photo_${pegawai.id}`);
   if (photo) setProfilePhoto(photo);
   const info = localStorage.getItem(`profile_info_${pegawai.id}`);
   if (info) setLocalInfo(JSON.parse(info));
  }
 }, [pegawai]);

 const handlePhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
   const reader = new FileReader();
   reader.onload = (event) => {
    const base64 = event.target?.result as string;
    setProfilePhoto(base64);
    if (pegawai) localStorage.setItem(`profile_photo_${pegawai.id}`, base64);
    setShowPhotoModal(false);
   };
   reader.readAsDataURL(file);
  }
 };

 const capturePhoto = () => {
  const imageSrc = webcamRef.current?.getScreenshot();
  if (imageSrc) {
   setProfilePhoto(imageSrc);
   if (pegawai) localStorage.setItem(`profile_photo_${pegawai.id}`, imageSrc);
   setShowPhotoModal(false);
   setUseCamera(false);
  }
 };


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
    const telp = (form.elements.namedItem('telp') as HTMLInputElement).value;
    const alamat = (form.elements.namedItem('alamat') as HTMLTextAreaElement).value;
    
    await supabase.from('pegawai').update({ nama }).eq('id', pegawai.id);
    setPegawai({...pegawai, nama});
    
    const info = { telp, alamat };
    localStorage.setItem(`profile_info_${pegawai.id}`, JSON.stringify(info));
    setLocalInfo(info);
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

   <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 p-8 rounded-3xl ">
    <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/60">Profil Pengguna</h1>
    <p className="text-sm font-medium text-slate-700 dark:text-white/50 mt-2">Kelola data personal dan biometrik Anda.</p>
   </div>

   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6">
    <div className="bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 rounded-3xl p-8 flex flex-col items-center text-center h-max transition-all relative overflow-hidden">
     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-green-400/30 dark:bg-green-500/20 blur-3xl rounded-t-3xl -z-10"></div>
     
     <div className="relative mb-6 group cursor-pointer" onClick={() => setShowPhotoModal(true)}>
      <div className="w-32 h-32 rounded-full bg-white dark:bg-black border-4 border-slate-300 dark:border-slate-700 flex items-center justify-center transition-all overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.2)]">
       {profilePhoto ? (
        <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
       ) : (
        <User className="w-14 h-14 text-slate-700 dark:text-white/60 group-hover:text-slate-900 dark:text-white transition-colors" />
       )}
      </div>
      <div className="absolute inset-0 bg-green-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-slate-900 dark:text-white dark:text-black rounded-full pointer-events-none">
       <Camera className="w-8 h-8" />
      </div>
     </div>
     <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
      {isLoading ? 'Memuat...' : pegawai?.nama || 'Belum Ada Profil'}
     </h2>
     <p className="text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-widest mt-1">
      {pegawai ? 'Pengguna Sistem' : 'Harap daftarkan wajah dulu'}
     </p>
     <div className={cn("mt-8 px-5 py-3 text-xs font-semibold uppercase tracking-widest rounded-full inline-flex items-center justify-center gap-3 w-full transition-all ", pegawai?.embedding ? "bg-green-400/20 dark:bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]" : "bg-red-500/10 text-red-400 border border-red-500/20")}>
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

    <div className="md:col-span-2 bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 rounded-3xl overflow-hidden flex flex-col transition-all relative">
     <div className="px-8 py-6 border-b border-slate-300 dark:border-slate-700 bg-white/5">
       <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Informasi Personal</h3>
     </div>
     
     <form onSubmit={handleSave} className="p-8 space-y-6 flex-1 flex flex-col relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
       <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700 dark:text-white/70 block">Nama Lengkap</label>
        <div className="relative">
         <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 dark:text-white/40" />
         <input name="nama" type="text" defaultValue={pegawai?.nama || ''} placeholder={isLoading ? "Memuat..." : "Masukkan nama"} className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all placeholder-slate-400 dark:placeholder-white/30" />
        </div>
       </div>
       
       <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700 dark:text-white/70 block">Nomor Induk / NIP</label>
        <div className="relative">
         <input type="text" defaultValue={pegawai?.nip || ''} placeholder="-" disabled className="w-full px-5 py-4 bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-slate-700 dark:text-white/40 text-sm font-semibold cursor-not-allowed" />
        </div>
       </div>

       <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700 dark:text-white/70 block">Email</label>
        <div className="relative">
         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 dark:text-white/40" />
         <input type="email" defaultValue={pegawai?.email || ''} disabled className="w-full pl-12 pr-4 py-4 bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-slate-700 dark:text-white/40 text-sm font-semibold cursor-not-allowed" />
        </div>
       </div>

       <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700 dark:text-white/70 block">No. Telepon</label>
        <div className="relative">
         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 dark:text-white/40" />
         <input type="tel" name="telp" value={localInfo.telp} onChange={e => setLocalInfo({...localInfo, telp: e.target.value})} placeholder="081234567890" className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all placeholder-slate-400 dark:placeholder-white/30" />
        </div>
       </div>
       
       <div className="space-y-2 md:col-span-2">
        <label className="text-xs font-medium text-slate-700 dark:text-white/70 block">Alamat</label>
        <div className="relative">
         <MapPin className="absolute left-4 top-5 w-5 h-5 text-slate-700 dark:text-white/40" />
         <textarea rows={3} name="alamat" value={localInfo.alamat} onChange={e => setLocalInfo({...localInfo, alamat: e.target.value})} placeholder="Alamat lengkap..." className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-300 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all resize-none placeholder-slate-400 dark:placeholder-white/30" />
        </div>
       </div>
      </div>

      <div className="flex justify-end gap-4 pt-8 border-t border-slate-300 dark:border-slate-700 mt-auto">
       <button type="button" className="px-8 py-3 rounded-full border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-white/70 hover:bg-slate-200 dark:bg-slate-700 shadow-sm dark:shadow-none hover:text-slate-900 dark:text-white transition-all">
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

   {showPhotoModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
     <div className="bg-slate-100 dark:bg-slate-800 shadow-xl border border-slate-300 dark:border-slate-700 w-full max-w-md rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="p-6 border-b border-slate-300 dark:border-slate-700 flex justify-between items-center">
       <h3 className="text-xl font-bold">Ubah Foto Profil</h3>
       <button onClick={() => { setShowPhotoModal(false); setUseCamera(false); }} className="text-slate-700 dark:text-white/50 hover:text-slate-900 dark:text-white">
        <X className="w-6 h-6" />
       </button>
      </div>
      
      <div className="p-6">
       {!useCamera ? (
        <div className="flex flex-col gap-4">
         <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoFile} className="hidden" />
         <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
          <Upload className="w-8 h-8 text-green-500" />
          <span className="font-semibold text-slate-700 dark:text-white">Pilih dari Galeri</span>
         </button>
         
         <div className="text-center text-xs font-semibold text-slate-700 dark:text-white/40 uppercase">Atau</div>
         
         <button onClick={() => setUseCamera(true)} className="w-full py-4 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
          <Camera className="w-8 h-8 text-green-500" />
          <span className="font-semibold text-slate-700 dark:text-white">Gunakan Kamera</span>
         </button>
        </div>
       ) : (
        <div className="space-y-4">
         <div className="rounded-2xl overflow-hidden border-2 border-green-500 bg-black aspect-video relative">
          <Webcam
           ref={webcamRef}
           screenshotFormat="image/jpeg"
           className="w-full h-full object-cover"
           mirrored={true}
          />
         </div>
         <div className="flex gap-3">
          <button onClick={() => setUseCamera(false)} className="flex-1 py-3 rounded-full border border-slate-300 dark:border-slate-600 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
           Kembali
          </button>
          <button onClick={capturePhoto} className="flex-1 py-3 bg-green-500 text-white font-bold text-sm rounded-full hover:bg-green-400 transition-colors">
           Ambil Foto
          </button>
         </div>
        </div>
       )}
      </div>
     </div>
    </div>
   )}
  </div>
 );
}

