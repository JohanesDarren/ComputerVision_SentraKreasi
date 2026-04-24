import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { ShieldCheck, User, ArrowRight, Camera, CheckCircle, RefreshCw, Upload, AlertCircle, Trash2, Mail, Lock } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { supabase } from '../lib/supabase';
import { registerFace } from '../lib/api';

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('admin@sentrakreasi.com');
  const [loginPassword, setLoginPassword] = useState('sentrakreasi123');
  
  // Register State
  const webcamRef = useRef<Webcam>(null);
  const [formData, setFormData] = useState({ nama: '', nip: '', email: '', password: '' });
  const [capturedImages, setCapturedImages] = useState<{depan: string|null, kiri: string|null, kanan: string|null}>({
    depan: null, kiri: null, kanan: null
  });
  const [activeAngle, setActiveAngle] = useState<'depan'|'kiri'|'kanan'>('depan');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{type: 'success'|'error'|'info', text: string} | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatusMsg({ type: 'info', text: 'Mencoba masuk...' });
    
    try {
      // Login dummy logic untuk demo (bisa diganti dengan supabase.auth.signInWithPassword)
      // Karena kita hanya butuh pemisahan role:
      if (loginEmail === 'admin@sentrakreasi.com' && loginPassword === 'sentrakreasi123') {
        setStatusMsg({ type: 'success', text: 'Login Admin Berhasil!' });
        setTimeout(() => navigate('/admin'), 1000);
      } else {
        // Cek apakah ada di pegawai
        const { data, error } = await supabase.from('pegawai').select('*').eq('email', loginEmail).single();
        if (data) {
          setStatusMsg({ type: 'success', text: 'Login Berhasil!' });
          setTimeout(() => navigate('/user'), 1000);
        } else {
          setStatusMsg({ type: 'error', text: 'Email atau password salah / belum terdaftar.' });
        }
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Terjadi kesalahan saat login.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImages(prev => ({ ...prev, [activeAngle]: imageSrc }));
      if (activeAngle === 'depan') setActiveAngle('kiri');
      else if (activeAngle === 'kiri') setActiveAngle('kanan');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nip || !formData.email || !formData.password) {
      setStatusMsg({ type: 'error', text: 'Semua field (Nama, NIP, Email, Password) harus diisi!' });
      return;
    }
    if (!capturedImages.depan || !capturedImages.kiri || !capturedImages.kanan) {
      setStatusMsg({ type: 'error', text: 'Anda harus menangkap 3 sisi wajah.' });
      return;
    }

    setIsProcessing(true);
    setStatusMsg({ type: 'info', text: '1/2 Menyimpan data ke Database Supabase...' });

    try {
      // 1. Simpan ke Supabase (tanpa Auth trigger untuk kemudahan demo)
      const { data: insertedData, error: insertErr } = await supabase
        .from('pegawai')
        .insert([{ 
          nama: formData.nama, 
          nip: formData.nip, 
          email: formData.email 
        }])
        .select()
        .single();

      if (insertErr || !insertedData) throw new Error(insertErr?.message || 'Gagal menyimpan data pegawai. (Email/NIP mungkin sudah dipakai)');
      
      setStatusMsg({ type: 'info', text: 'Data disimpan. 2/2 Memproses wajah ke AI...' });

      // 2. Kirim ke FastAPI untuk Face Vectorization
      const images = [capturedImages.depan, capturedImages.kiri, capturedImages.kanan];
      await registerFace(insertedData.id, images);
      
      setStatusMsg({ type: 'success', text: `Berhasil! Akun dan Wajah telah didaftarkan.` });
      
      setTimeout(() => {
        setMode('login');
        setLoginEmail(formData.email);
        setLoginPassword(formData.password);
        setStatusMsg(null);
      }, 2000);
      
    } catch (err: any) {
      console.error(err);
      setStatusMsg({ type: 'error', text: err.message || 'Terjadi kesalahan saat mendaftarkan.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] dark:bg-[#151413] text-[#2C2825] dark:text-[#EFEBE1] font-sans overflow-y-auto transition-colors duration-300 p-4 md:p-8 selection:bg-[#386641] selection:text-white pb-20">
      <div className="fixed inset-0 z-0 pointer-events-none bg-brutalist-grid opacity-60"></div>
      
      <div className="absolute top-6 right-6 z-20 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-black/20 dark:border-white/20 p-2">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center pt-8">
        <img src="/logo.png" alt="SentraKreasi" className="h-16 w-auto object-contain drop-shadow-sm mb-4" />
        
        <div className="flex bg-[#EFEBE1] dark:bg-[#1E1C1A] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] mb-8 w-full max-w-md">
          <button onClick={() => setMode('login')} className={`flex-1 py-4 font-[Bebas_Neue] text-2xl uppercase tracking-widest transition-colors ${mode === 'login' ? 'bg-[#2C2825] text-white dark:bg-[#EFEBE1] dark:text-[#151413]' : 'text-[#2C2825] dark:text-[#EFEBE1] hover:bg-[#FAF8F5] dark:hover:bg-[#2A2621]'}`}>
            Masuk (Login)
          </button>
          <div className="w-[4px] bg-[#2C2825] dark:bg-[#EFEBE1]"></div>
          <button onClick={() => setMode('register')} className={`flex-1 py-4 font-[Bebas_Neue] text-2xl uppercase tracking-widest transition-colors ${mode === 'register' ? 'bg-[#2C2825] text-white dark:bg-[#EFEBE1] dark:text-[#151413]' : 'text-[#2C2825] dark:text-[#EFEBE1] hover:bg-[#FAF8F5] dark:hover:bg-[#2A2621]'}`}>
            Daftar Baru
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="w-full max-w-md bg-[#FAF8F5] dark:bg-[#2A2621] border-[6px] border-[#2C2825] dark:border-[#EFEBE1] p-8 space-y-6">
             <h2 className="font-[Bebas_Neue] text-4xl text-center uppercase tracking-wide mb-6 text-[#2C2825] dark:text-[#EFEBE1]">Autentikasi Sistem</h2>
             
             <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1] block mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2C2825] dark:text-[#EFEBE1]" />
                    <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] font-bold text-[#2C2825] dark:text-[#EFEBE1] focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1] block mb-2">Kata Sandi</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2C2825] dark:text-[#EFEBE1]" />
                    <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] font-bold text-[#2C2825] dark:text-[#EFEBE1] focus:outline-none" />
                  </div>
                </div>
             </div>

             {statusMsg && mode === 'login' && (
                <div className={`p-4 border-[3px] border-[#2C2825] text-xs font-bold uppercase flex items-center gap-2 ${statusMsg.type === 'success' ? 'bg-[#386641] text-white' : 'bg-[#E36D4F] text-white'}`}>
                   {statusMsg.type === 'info' && <RefreshCw className="w-4 h-4 animate-spin" />}
                   {statusMsg.text}
                </div>
             )}

             <button type="submit" disabled={isProcessing} className="w-full p-4 bg-[#386641] text-white font-[Bebas_Neue] text-3xl uppercase tracking-widest hover:bg-[#2C2825] transition-colors border-[4px] border-[#2C2825] dark:border-[#EFEBE1] disabled:opacity-50">
               {isProcessing ? 'Memproses...' : 'Masuk Sekarang'}
             </button>
          </form>
        ) : (
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Kolom Kiri: Form & Kamera */}
            <div className="space-y-6">
              <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-6 space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-2">Nama Lengkap</label>
                  <input type="text" value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })} className="w-full bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] p-3 font-bold focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-2">NIP / ID Unik</label>
                  <input type="text" value={formData.nip} onChange={e => setFormData({ ...formData, nip: e.target.value })} className="w-full bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] p-3 font-bold focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-2">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] p-3 font-bold focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest block mb-2">Kata Sandi</label>
                  <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] p-3 font-bold focus:outline-none" />
                </div>
              </div>

              <div className="bg-[#EFEBE1] dark:bg-[#1E1C1A] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-2 relative aspect-[4/3]">
                 <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="object-cover w-full h-full" videoConstraints={{ facingMode: "user" }} />
                 <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <span className="bg-[#FAF8F5] text-[#2C2825] border-[2px] border-[#2C2825] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Kamera Registrasi</span>
                    <button type="button" onClick={handleCapture} className="bg-[#386641] text-white border-[2px] border-[#2C2825] px-4 py-2 text-xs font-bold uppercase hover:bg-[#2C2825] transition-colors flex items-center gap-2">
                      <Camera className="w-4 h-4" /> Tangkap Sisi {activeAngle.toUpperCase()}
                    </button>
                 </div>
              </div>
            </div>

            {/* Kolom Kanan: Preview Sudut */}
            <div className="space-y-6 flex flex-col">
              <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-6 flex-1 flex flex-col">
                 <h3 className="font-[Bebas_Neue] text-3xl uppercase border-b-[3px] border-[#2C2825] dark:border-[#EFEBE1] pb-4 mb-6">Pratinjau 3 Sudut Wajah</h3>
                 
                 <div className="space-y-4 flex-1">
                    {(['depan', 'kiri', 'kanan'] as const).map((angle) => (
                       <div key={angle} className={`border-[3px] p-3 flex items-center gap-4 transition-colors ${activeAngle === angle ? 'border-[#386641] bg-[#386641]/10' : 'border-[#2C2825] dark:border-[#EFEBE1] bg-[#EFEBE1] dark:bg-[#151413]'}`}>
                          <div className="w-20 h-20 border-[2px] border-[#2C2825] dark:border-[#EFEBE1] bg-[#FAF8F5] dark:bg-[#2A2621] overflow-hidden flex items-center justify-center shrink-0">
                             {capturedImages[angle] ? (
                                <img src={capturedImages[angle] as string} alt={angle} className="object-cover w-full h-full" />
                             ) : (
                                <span className="text-[10px] font-bold text-[#A89886] uppercase">KOSONG</span>
                             )}
                          </div>
                          <div className="flex-1">
                             <h4 className="font-[Bebas_Neue] text-2xl uppercase">Sisi {angle}</h4>
                             <p className="text-[10px] font-bold uppercase text-[#6B5A4B] dark:text-[#A89886]">
                                {capturedImages[angle] ? 'Tertangkap' : 'Menunggu Kamera'}
                             </p>
                          </div>
                          {capturedImages[angle] && (
                             <button type="button" onClick={() => { setCapturedImages(prev => ({...prev, [angle]: null})); setActiveAngle(angle); }} className="p-2 bg-[#E36D4F] text-white border-[2px] border-[#2C2825] hover:bg-[#2C2825]">
                                <Trash2 className="w-4 h-4" />
                             </button>
                          )}
                       </div>
                    ))}
                 </div>

                 {statusMsg && mode === 'register' && (
                    <div className={`mt-6 p-4 border-[3px] border-[#2C2825] text-xs font-bold uppercase tracking-widest flex items-center gap-3 ${statusMsg.type === 'success' ? 'bg-[#386641] text-white' : statusMsg.type === 'error' ? 'bg-[#E36D4F] text-white' : 'bg-[#EFEBE1] text-[#2C2825]'}`}>
                       {statusMsg.type === 'error' && <AlertCircle className="w-5 h-5" />}
                       {statusMsg.type === 'success' && <CheckCircle className="w-5 h-5" />}
                       {statusMsg.type === 'info' && <RefreshCw className="w-5 h-5 animate-spin" />}
                       {statusMsg.text}
                    </div>
                 )}

                 <button 
                    onClick={handleRegister}
                    disabled={isProcessing || !capturedImages.depan || !capturedImages.kiri || !capturedImages.kanan}
                    className={`mt-6 w-full p-4 font-[Bebas_Neue] text-3xl uppercase flex items-center justify-center gap-3 border-[4px] border-[#2C2825] dark:border-[#EFEBE1] transition-colors ${
                       isProcessing || (!capturedImages.depan || !capturedImages.kiri || !capturedImages.kanan) 
                       ? 'bg-[#EFEBE1] dark:bg-[#1E1C1A] text-[#A89886] cursor-not-allowed'
                       : 'bg-[#386641] text-white hover:bg-[#2C2825]'
                    }`}
                 >
                    {isProcessing ? <><RefreshCw className="w-6 h-6 animate-spin mt-1" /> Memproses...</> : <><Upload className="w-6 h-6 mt-1" /> Daftar & Rekam Wajah</>}
                 </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
