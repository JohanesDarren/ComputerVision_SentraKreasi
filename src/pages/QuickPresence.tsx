import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Smile, Frown, ScanFace, ScanLine, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { verifyFacePresence } from '../lib/api';

export default function QuickPresence() {
 const navigate = useNavigate();
 const webcamRef = useRef<Webcam>(null);
 const [isScanning, setIsScanning] = useState(false);
 const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);
 const [errorMessage, setErrorMessage] = useState<string>('');
 const [pegawaiData, setPegawaiData] = useState<any>(null);

 const handleCapture = useCallback(async () => {
  setIsScanning(true);
  setScanResult(null);
  
  const imageSrc = webcamRef.current?.getScreenshot();
  
  if (!imageSrc) {
   setIsScanning(false);
   return;
  }

  try {
   const apiResult = await verifyFacePresence(imageSrc);
   
   if (apiResult.status === 'success') {
    const pData = apiResult.data;
    setPegawaiData(pData);
    setScanResult('success');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const aturanData = localStorage.getItem('app_aturan_standar');
    let activeAturan = null;
    if (aturanData) {
      activeAturan = JSON.parse(aturanData);
    }
    
    // Format YYYY-MM-DD local logic safely
    const todayObj = new Date();
    const tzOffset = todayObj.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(todayObj.getTime() - tzOffset)).toISOString().split('T')[0];
    
    if (activeAturan && activeAturan.hari_libur) {
      const liburHariIni = activeAturan.hari_libur.find((d: any) => d.tanggal === localISOTime);
      if (liburHariIni) {
        throw new Error(`Hari ini adalah ${liburHariIni.nama}, sistem presensi ditutup.`);
      }
    }

    let isLate = false;
    if (activeAturan && activeAturan.jam_masuk) {
      const [masukH, masukM] = activeAturan.jam_masuk.split(':').map(Number);
      const toleransi = activeAturan.toleransi_menit || 0;
      
      const batasMasukDate = new Date();
      batasMasukDate.setHours(masukH, masukM, 0, 0);
      batasMasukDate.setMinutes(batasMasukDate.getMinutes() + toleransi);
      
      if (new Date() > batasMasukDate) {
        isLate = true;
      }
    } else {
      const currentHour = new Date().getHours();
      const currentMinute = new Date().getMinutes();
      isLate = currentHour > 7 || (currentHour === 7 && currentMinute > 0);
    }
    
    const { data: records } = await supabase
     .from('presensi')
     .select('status')
     .eq('pegawai_id', pData.pegawai_id)
     .gte('waktu_hadir', today.toISOString());
     
    let newStatus = isLate ? 'telat' : 'masuk';
    let statusMessage = isLate ? 'Hadir (Telat)' : 'Hadir (Masuk)';

    if (records && records.length > 0) {
      const hasMasuk = records.some(r => ['masuk', 'hadir', 'telat'].includes(r.status));
      const hasPulang = records.some(r => r.status === 'pulang');
      
      if (hasMasuk && hasPulang) {
       throw new Error('Anda sudah melakukan presensi masuk dan pulang hari ini.');
      } else if (hasMasuk) {
       if (activeAturan && activeAturan.jam_keluar) {
         const [keluarH, keluarM] = activeAturan.jam_keluar.split(':').map(Number);
         const batasKeluarDate = new Date();
         batasKeluarDate.setHours(keluarH, keluarM, 0, 0);
         
         if (new Date() < batasKeluarDate) {
           throw new Error('Status: Pulang Terlalu Cepat. Presensi ditolak karena belum waktunya pulang.');
         }
       }
       newStatus = 'pulang';
       statusMessage = 'Selesai (Pulang)';
      }
    }

    await supabase.from('presensi').insert([
     {
      pegawai_id: pData.pegawai_id,
      status: newStatus,
      gambar_bukti_url: imageSrc 
     }
    ]);
    
    setPegawaiData({ ...pData, statusMessage });
   } else {
    throw new Error(apiResult.message || 'Verifikasi gagal');
   }
  } catch(err: any) {
   console.error('Error in face verification:', err);
   setErrorMessage(err.message || 'Terjadi kesalahan saat memverifikasi wajah.');
   setScanResult('error');
  } finally {
   setIsScanning(false);
   setTimeout(() => setScanResult(null), 5000);
  }
 }, []);

 return (
  <div className="relative min-h-screen bg-gradient-to-br from-[#e0f2fe] via-[#f0fdf4] to-[#ffffff] dark:from-[#020617] dark:via-[#022c22] dark:to-[#000000] text-slate-800 dark:text-white font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-white p-4 md:p-8">
   
   {/* Background Glow */}
   <div className="fixed inset-0 z-0 pointer-events-none">
     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
     <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-400/20 dark:bg-cyan-900/30 rounded-full blur-[150px] mix-blend-screen"></div>
   </div>

   <div className="relative z-10 max-w-4xl mx-auto space-y-6">
    <div className="flex items-center justify-between mb-8">
     <button onClick={() => navigate('/')} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 text-sm font-semibold transition-all shadow-sm dark:shadow-none text-slate-800 dark:text-white">
      <ArrowLeft className="w-4 h-4" /> Kembali
     </button>
     <img src="/logo.png" alt="SentraKreasi" className="h-8 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] dark:drop-shadow-sm brightness-110 dark:brightness-200" />
    </div>

    <div className="text-center mb-8">
     <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Presensi Cepat</h1>
     <p className="text-slate-600 dark:text-slate-400">Arahkan wajah Anda ke kamera untuk melakukan presensi tanpa login.</p>
    </div>

    <div className="relative overflow-hidden bg-black border border-slate-300 dark:border-slate-700 rounded-[2.5rem] aspect-[4/3] md:aspect-[16/9] isolate flex items-center justify-center shadow-2xl">
     <Webcam
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      className="object-cover w-full h-full absolute inset-0 -z-10"
      videoConstraints={{ facingMode: "user" }}
     />

     <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none flex-col">
      <div className="relative flex items-center justify-center">
       <div className="absolute w-[280px] h-[280px] md:w-[360px] md:h-[360px] border border-emerald-500/30 rounded-full flex items-center justify-center">
         <div className="w-full h-full absolute rounded-full border border-emerald-500/10 scale-125 animate-pulse"></div>
       </div>

       <div className="relative w-56 h-56 md:w-72 md:h-72 border-2 border-emerald-500/50 rounded-3xl bg-emerald-500/5 flex flex-col justify-between p-2 shadow-[inset_0_0_50px_rgba(16,185,129,0.1)]">
        <div className="flex justify-between">
         <div className="w-8 h-8 border-t-4 border-l-4 rounded-tl-xl border-emerald-500"></div>
         <div className="w-8 h-8 border-t-4 border-r-4 rounded-tr-xl border-emerald-500"></div>
        </div>
        
        {isScanning && (
         <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 animate-[scanline_2s_ease-in-out_infinite] flex justify-center shadow-[0_0_20px_rgba(16,185,129,1)]"></div>
        )}
        
        {!isScanning && !scanResult && (
          <div className="self-center flex items-center gap-2 bg-white/80 dark:bg-black/50 px-4 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-500/30">
           <ScanLine className="w-4 h-4" /> Area Pindai Wajah
          </div>
        )}
        {isScanning && (
          <div className="self-center flex items-center gap-2 bg-emerald-500 px-4 py-2 text-xs font-semibold text-white dark:text-black rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-pulse">
           <RefreshCw className="w-4 h-4 animate-spin" /> Menganalisis...
          </div>
        )}

        <div className="flex justify-between mt-auto">
         <div className="w-8 h-8 border-b-4 border-l-4 rounded-bl-xl border-emerald-500"></div>
         <div className="w-8 h-8 border-b-4 border-r-4 rounded-br-xl border-emerald-500"></div>
        </div>
       </div>
      </div>
     </div>

     <div className="absolute bottom-6 inset-x-0 z-30 flex justify-center">
      <button
       onClick={handleCapture}
       disabled={isScanning || scanResult === 'success'}
       className={cn(
        "flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold transition-all ",
        isScanning 
         ? "bg-slate-200 dark:bg-slate-700 shadow-sm dark:shadow-none text-slate-500 dark:text-white/40 cursor-not-allowed border border-white/5" 
         : "bg-emerald-500 text-white dark:text-black hover:bg-emerald-600 dark:hover:bg-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.4)] dark:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105"
       )}
      >
       {isScanning ? (
        <>
         <RefreshCw className="w-5 h-5 animate-spin" />
         <span>Memproses...</span>
        </>
       ) : (
        <>
         <Camera className="w-5 h-5" />
         <span>Pindai Wajah Sekarang</span>
        </>
       )}
      </button>
     </div>

     <AnimatePresence>
      {scanResult === 'success' && pegawaiData && (
       <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="absolute top-6 left-6 right-6 z-30 flex justify-center"
       >
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-3xl p-5 md:p-6 flex items-center gap-5 text-left w-full max-w-md shadow-2xl">
         <div className="w-14 h-14 bg-emerald-500 text-white dark:text-black rounded-2xl flex items-center justify-center shrink-0 shadow-[0_4px_20px_rgba(16,185,129,0.4)] dark:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
           <Smile className="w-7 h-7" />
         </div>
         <div>
           <h3 className="text-xl font-bold text-slate-900 dark:text-white">Presensi {pegawaiData.statusMessage}</h3>
           <p className="text-sm font-medium text-slate-600 dark:text-white/70 mt-1">
            Selamat Datang, <span className="text-emerald-600 dark:text-emerald-400 font-bold">{pegawaiData.nama}</span>.<br/> NIP: {pegawaiData.nip}
           </p>
         </div>
        </div>
       </motion.div>
      )}

      {scanResult === 'error' && (
       <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="absolute top-6 left-6 right-6 z-30 flex justify-center"
       >
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-3xl p-5 md:p-6 flex items-center gap-5 text-left w-full max-w-md shadow-2xl">
         <div className="w-14 h-14 bg-red-500 text-white dark:text-black rounded-2xl flex items-center justify-center shrink-0 shadow-[0_4px_20px_rgba(239,68,68,0.4)] dark:shadow-[0_0_20px_rgba(239,68,68,0.4)]">
           <Frown className="w-7 h-7" />
         </div>
         <div>
           <h3 className="text-xl font-bold text-slate-900 dark:text-white">Presensi Gagal</h3>
           <p className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">
            {errorMessage}
           </p>
         </div>
        </div>
       </motion.div>
      )}
     </AnimatePresence>
    </div>
   </div>
  </div>
 );
}
