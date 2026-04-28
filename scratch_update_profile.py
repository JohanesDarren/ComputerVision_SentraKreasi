import os

with open('src/pages/Profile.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
content = content.replace(
    "import { User, Mail, Phone, MapPin, Save, Camera, AlertCircle } from 'lucide-react';",
    "import { User, Mail, Phone, MapPin, Save, Camera, AlertCircle, Upload, X } from 'lucide-react';\nimport Webcam from 'react-webcam';\nimport { useRef } from 'react';"
)

# Add states
states_injection = """ const [showPhotoModal, setShowPhotoModal] = useState(false);
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
"""

content = content.replace(" const [isLoading, setIsLoading] = useState(true);", " const [isLoading, setIsLoading] = useState(true);\n" + states_injection)

# Modify handleSave
save_logic_old = """    const form = e.target as HTMLFormElement;
    const nama = (form.elements.namedItem('nama') as HTMLInputElement).value;
    
    await supabase.from('pegawai').update({ nama }).eq('id', pegawai.id);
    setPegawai({...pegawai, nama});"""
save_logic_new = """    const form = e.target as HTMLFormElement;
    const nama = (form.elements.namedItem('nama') as HTMLInputElement).value;
    const telp = (form.elements.namedItem('telp') as HTMLInputElement).value;
    const alamat = (form.elements.namedItem('alamat') as HTMLTextAreaElement).value;
    
    await supabase.from('pegawai').update({ nama }).eq('id', pegawai.id);
    setPegawai({...pegawai, nama});
    
    const info = { telp, alamat };
    localStorage.setItem(`profile_info_${pegawai.id}`, JSON.stringify(info));
    setLocalInfo(info);"""
content = content.replace(save_logic_old, save_logic_new)

# Modify Photo Area
photo_area_old = """      <div className="w-32 h-32 rounded-full bg-white dark:bg-black border-4 border-slate-300 dark:border-slate-700 flex items-center justify-center transition-all overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.2)]">
       <User className="w-14 h-14 text-slate-700 dark:text-white/60 group-hover:text-slate-900 dark:text-white transition-colors" />
      </div>"""
photo_area_new = """      <div onClick={() => setShowPhotoModal(true)} className="w-32 h-32 rounded-full bg-white dark:bg-black border-4 border-slate-300 dark:border-slate-700 flex items-center justify-center transition-all overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.2)]">
       {profilePhoto ? (
        <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
       ) : (
        <User className="w-14 h-14 text-slate-700 dark:text-white/60 group-hover:text-slate-900 dark:text-white transition-colors" />
       )}
      </div>"""
content = content.replace(photo_area_old, photo_area_new)

# Modify Default Values for Inputs
content = content.replace('defaultValue="081234567890"', 'name="telp" value={localInfo.telp} onChange={e => setLocalInfo({...localInfo, telp: e.target.value})} placeholder="081234567890"')
content = content.replace('defaultValue="Jl. Sudirman No. 123, Jakarta Selatan"', 'name="alamat" value={localInfo.alamat} onChange={e => setLocalInfo({...localInfo, alamat: e.target.value})} placeholder="Alamat lengkap..."')


# Add Modal HTML at the end of the return statement
modal_html = """
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
"""

content = content.replace("  </div>\n );\n}", modal_html)

with open('src/pages/Profile.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Profile.tsx updated")
