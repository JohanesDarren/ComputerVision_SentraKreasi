import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Camera, CheckCircle, RefreshCw, Upload, AlertCircle, Trash2, Mail, Lock, User, ArrowRight } from 'lucide-react';
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
      if (loginEmail === 'admin@sentrakreasi.com' && loginPassword === 'sentrakreasi123') {
        setStatusMsg({ type: 'success', text: 'Login Admin Berhasil!' });
        setTimeout(() => navigate('/admin'), 1000);
      } else {
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
      setStatusMsg({ type: 'error', text: 'Semua field harus diisi!' });
      return;
    }
    if (!capturedImages.depan || !capturedImages.kiri || !capturedImages.kanan) {
      setStatusMsg({ type: 'error', text: 'Anda harus menangkap 3 sisi wajah.' });
      return;
    }

    setIsProcessing(true);
    setStatusMsg({ type: 'info', text: '1/2 Menyimpan data...' });

    try {
      const { data: insertedData, error: insertErr } = await supabase
        .from('pegawai')
        .insert([{ nama: formData.nama, nip: formData.nip, email: formData.email }])
        .select()
        .single();

      if (insertErr || !insertedData) throw new Error(insertErr?.message || 'Gagal menyimpan data (Email/NIP sudah dipakai)');
      
      setStatusMsg({ type: 'info', text: 'Data disimpan. 2/2 Memproses wajah...' });

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
    <div className="relative min-h-screen bg-gradient-to-br from-[#e8f5e9] via-[#f1f8f5] to-[#ffffff] dark:from-[#021208] dark:via-[#0a2e15] dark:to-[#000000] text-slate-900 dark:text-white font-sans overflow-y-auto selection:bg-green-500 selection:text-slate-900 dark:text-white p-4 md:p-8 flex items-center justify-center">
      
      {/* Background Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-green-400/20 dark:bg-green-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
         <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-400/30 dark:bg-cyan-900/40 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        <img onClick={() => navigate('/')} src="/logo.png" alt="SentraKreasi" className="h-12 w-auto object-contain brightness-200 opacity-80 hover:opacity-100 transition-opacity cursor-pointer mb-10" />
        
        <div className="flex bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-full mb-10 w-full max-w-md p-1 backdrop-blur-md">
          <button onClick={() => setMode('login')} className={`flex-1 py-3 px-6 rounded-full text-sm font-semibold transition-all ${mode === 'login' ? 'bg-green-500 text-white dark:text-black dark:text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'text-slate-700 dark:text-white/60 hover:text-white'}`}>
            Masuk (Login)
          </button>
          <button onClick={() => setMode('register')} className={`flex-1 py-3 px-6 rounded-full text-sm font-semibold transition-all ${mode === 'register' ? 'bg-green-500 text-white dark:text-black dark:text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'text-slate-700 dark:text-white/60 hover:text-white'}`}>
            Daftar Baru
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="w-full max-w-md bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 p-8 md:p-10 rounded-3xl backdrop-blur-xl shadow-2xl">
             <div className="text-center mb-8">
               <h2 className="text-3xl font-bold tracking-tight mb-2">Selamat Datang</h2>
               <p className="text-sm text-slate-700 dark:text-white/50">Masukkan kredensial untuk mengakses sistem.</p>
             </div>
             
             <div className="space-y-5">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-white/70 block mb-2">Alamat Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 dark:text-white/40" />
                    <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all" placeholder="email@contoh.com" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-white/70 block mb-2">Kata Sandi</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 dark:text-white/40" />
                    <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all" placeholder="••••••••" />
                  </div>
                </div>
             </div>

             {statusMsg && mode === 'login' && (
                <div className={`mt-6 p-4 rounded-2xl text-sm flex items-center gap-3 ${statusMsg.type === 'success' ? 'bg-green-400/20 dark:bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                   {statusMsg.type === 'info' && <RefreshCw className="w-4 h-4 animate-spin" />}
                   {statusMsg.type === 'success' && <CheckCircle className="w-4 h-4" />}
                   {statusMsg.type === 'error' && <AlertCircle className="w-4 h-4" />}
                   {statusMsg.text}
                </div>
             )}

             <button type="submit" disabled={isProcessing} className="w-full mt-8 p-4 bg-green-500 text-white dark:text-black dark:text-black rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
               {isProcessing ? <><RefreshCw className="w-4 h-4 animate-spin" /> Memproses...</> : 'Masuk Sekarang'}
             </button>
          </form>
        ) : (
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-3xl p-8 backdrop-blur-xl space-y-5">
                <h3 className="text-xl font-bold mb-6">Data Diri Pribadi</h3>
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-white/70 block mb-2">Nama Lengkap</label>
                  <input type="text" value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })} className="w-full bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-green-500/50 transition-all" placeholder="Masukkan nama" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-white/70 block mb-2">NIP / ID Unik</label>
                  <input type="text" value={formData.nip} onChange={e => setFormData({ ...formData, nip: e.target.value })} className="w-full bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-green-500/50 transition-all" placeholder="Nomor Induk" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-white/70 block mb-2">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-green-500/50 transition-all" placeholder="email@contoh.com" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-white/70 block mb-2">Kata Sandi</label>
                  <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-green-500/50 transition-all" placeholder="••••••••" />
                </div>
              </div>

              <div className="bg-black border border-slate-900/10 dark:border-white/10 rounded-3xl p-2 relative aspect-[4/3] overflow-hidden">
                 <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="object-cover w-full h-full rounded-2xl" videoConstraints={{ facingMode: "user" }} />
                 <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-10">
                    <span className="bg-white/80 dark:bg-black/50 backdrop-blur-md text-slate-700 dark:text-white/80 border border-slate-900/10 dark:border-white/10 px-3 py-1 rounded-full text-xs font-medium">Kamera Aktif</span>
                    <button type="button" onClick={handleCapture} className="bg-green-500 text-white dark:text-black dark:text-black px-4 py-2 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:bg-green-400 transition-all flex items-center gap-2">
                      <Camera className="w-4 h-4" /> Tangkap {activeAngle}
                    </button>
                 </div>
              </div>
            </div>

            <div className="space-y-6 flex flex-col">
              <div className="bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-3xl p-8 backdrop-blur-xl flex-1 flex flex-col">
                 <h3 className="text-xl font-bold mb-6">Perekaman 3 Sudut</h3>
                 
                 <div className="space-y-4 flex-1">
                    {(['depan', 'kiri', 'kanan'] as const).map((angle) => (
                       <div key={angle} className={`border p-4 rounded-2xl flex items-center gap-4 transition-all ${activeAngle === angle ? 'border-green-500/50 bg-green-500/5' : 'border-slate-900/10 dark:border-white/10 bg-white/5'}`}>
                          <div className="w-16 h-16 rounded-xl border border-slate-900/10 dark:border-white/10 bg-white/80 dark:bg-black/50 overflow-hidden flex items-center justify-center shrink-0">
                             {capturedImages[angle] ? (
                                <img src={capturedImages[angle] as string} alt={angle} className="object-cover w-full h-full" />
                             ) : (
                                <User className="w-6 h-6 text-slate-900/20 dark:text-slate-300 dark:text-white/20" />
                             )}
                          </div>
                          <div className="flex-1">
                             <h4 className="font-semibold text-sm capitalize">Sisi {angle}</h4>
                             <p className="text-xs text-slate-700 dark:text-white/50">
                                {capturedImages[angle] ? 'Tertangkap' : 'Menunggu Kamera'}
                             </p>
                          </div>
                          {capturedImages[angle] && (
                             <button type="button" onClick={() => { setCapturedImages(prev => ({...prev, [angle]: null})); setActiveAngle(angle); }} className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                                <Trash2 className="w-4 h-4" />
                             </button>
                          )}
                       </div>
                    ))}
                 </div>

                 {statusMsg && mode === 'register' && (
                    <div className={`mt-6 p-4 rounded-2xl text-sm flex items-center gap-3 ${statusMsg.type === 'success' ? 'bg-green-400/20 dark:bg-green-500/10 text-green-400 border border-green-500/20' : statusMsg.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-white/90 dark:bg-white/10 shadow-xl dark:shadow-none text-slate-700 dark:text-white/80 border border-white/10'}`}>
                       {statusMsg.type === 'error' && <AlertCircle className="w-4 h-4" />}
                       {statusMsg.type === 'success' && <CheckCircle className="w-4 h-4" />}
                       {statusMsg.type === 'info' && <RefreshCw className="w-4 h-4 animate-spin" />}
                       {statusMsg.text}
                    </div>
                 )}

                 <button 
                    onClick={handleRegister}
                    disabled={isProcessing || !capturedImages.depan || !capturedImages.kiri || !capturedImages.kanan}
                    className="w-full mt-6 p-4 bg-green-500 text-white dark:text-black dark:text-black rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {isProcessing ? <><RefreshCw className="w-4 h-4 animate-spin" /> Memproses...</> : <><Upload className="w-4 h-4" /> Buat Akun & Registrasi Wajah</>}
                 </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
