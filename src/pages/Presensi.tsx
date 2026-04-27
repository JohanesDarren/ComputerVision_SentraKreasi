import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Smile, Frown, ScanFace, ScanLine } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { verifyFacePresence } from '../lib/api';

export default function Presensi() {
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

        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        const isLate = currentHour > 7 || (currentHour === 7 && currentMinute > 0);
        
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
              newStatus = 'pulang';
              statusMessage = 'Selesai (Pulang)';
           }
        }

        await supabase.from('presensi').insert([
          {
            pegawai_id: pData.pegawai_id,
            status: newStatus,
            gambar_bukti_url: null 
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
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-900 dark:text-white">
      <div className="mb-4 bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-3xl p-8 backdrop-blur-xl">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-white/60">Biometrik Cerdas</h1>
        <p className="text-sm font-medium text-slate-700 dark:text-white/50 mt-2">Arahkan wajah ke kamera, AI akan mendeteksi ekspresi Anda.</p>
      </div>

      <div className="relative overflow-hidden bg-black border border-slate-900/10 dark:border-white/10 rounded-[2.5rem] aspect-[4/3] md:aspect-[16/9] isolate flex items-center justify-center shadow-2xl">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="object-cover w-full h-full absolute inset-0 -z-10"
          videoConstraints={{ facingMode: "user" }}
        />

        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none flex-col">
          <div className="relative flex items-center justify-center">
            
            <div className="absolute w-[280px] h-[280px] md:w-[360px] md:h-[360px] border border-green-500/30 rounded-full flex items-center justify-center">
               <div className="w-full h-full absolute rounded-full border border-green-500/10 scale-125 animate-pulse"></div>
            </div>

            <div className="relative w-56 h-56 md:w-72 md:h-72 border-2 border-green-500/50 rounded-3xl bg-green-500/5 flex flex-col justify-between p-2 shadow-[inset_0_0_50px_rgba(34,197,94,0.1)]">
              <div className="flex justify-between">
                <div className="w-8 h-8 border-t-4 border-l-4 rounded-tl-xl border-green-500"></div>
                <div className="w-8 h-8 border-t-4 border-r-4 rounded-tr-xl border-green-500"></div>
              </div>
              
              {isScanning && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-green-500 animate-[scanline_2s_ease-in-out_infinite] flex justify-center shadow-[0_0_20px_rgba(34,197,94,1)]"></div>
              )}
              
              {!isScanning && !scanResult && (
                 <div className="self-center flex items-center gap-2 bg-white/80 dark:bg-black/50 backdrop-blur-md px-4 py-2 text-xs font-semibold text-green-400 rounded-full border border-green-500/30">
                   <ScanLine className="w-4 h-4" /> Area Pindai Wajah
                 </div>
              )}
              {isScanning && (
                 <div className="self-center flex items-center gap-2 bg-green-500 px-4 py-2 text-xs font-semibold text-slate-900 dark:text-white dark:text-black rounded-full shadow-[0_0_20px_rgba(34,197,94,0.5)] animate-pulse">
                   <RefreshCw className="w-4 h-4 animate-spin" /> Menganalisis...
                 </div>
              )}

              <div className="flex justify-between mt-auto">
                <div className="w-8 h-8 border-b-4 border-l-4 rounded-bl-xl border-green-500"></div>
                <div className="w-8 h-8 border-b-4 border-r-4 rounded-br-xl border-green-500"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 inset-x-0 z-30 px-6 md:px-8 flex flex-col justify-end gap-4 md:flex-row md:justify-between md:items-end">
          <div className="bg-white/70 dark:bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-slate-900/10 dark:border-white/10 max-w-[200px]">
            <p className="text-slate-700 dark:text-white/50 text-xs font-medium mb-1">Sensor Biometrik</p>
            <h2 className="text-slate-900 dark:text-white font-bold text-lg flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse"></span>Kamera Aktif
            </h2>
          </div>
          <button
            onClick={handleCapture}
            disabled={isScanning || scanResult === 'success'}
            className={cn(
              "flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold transition-all",
              isScanning 
                ? "bg-white/90 dark:bg-white/10 shadow-xl dark:shadow-none text-slate-700 dark:text-white/40 cursor-not-allowed border border-white/5" 
                : "bg-green-500 text-white dark:text-black dark:text-black hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
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
              <div className="bg-green-400/20 dark:bg-green-500/10 backdrop-blur-2xl border border-green-500/30 rounded-3xl p-5 md:p-6 flex items-center gap-5 text-left w-full max-w-md shadow-2xl">
                <div className="w-14 h-14 bg-green-500 text-white dark:text-black dark:text-black rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                   <Smile className="w-7 h-7" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white">Presensi {pegawaiData.statusMessage}</h3>
                   <p className="text-sm font-medium text-slate-700 dark:text-white/70 mt-1">
                     Selamat Datang, <span className="text-green-400 font-semibold">{pegawaiData.nama}</span>.<br/> NIP: {pegawaiData.nip}
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
              <div className="bg-red-500/10 backdrop-blur-2xl border border-red-500/30 rounded-3xl p-5 md:p-6 flex items-center gap-5 text-left w-full max-w-md shadow-2xl">
                <div className="w-14 h-14 bg-red-500 text-white dark:text-black rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                   <Frown className="w-7 h-7" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white">Presensi Gagal</h3>
                   <p className="text-sm font-medium text-red-400 mt-1">
                     {errorMessage}
                   </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10 rounded-3xl p-6 flex items-center gap-6 overflow-x-auto backdrop-blur-xl">
        <div className="px-4 border-r border-slate-900/10 dark:border-white/10 whitespace-nowrap">
          <p className="text-xs font-medium text-slate-700 dark:text-white/50 mb-1">Akurasi AI</p>
          <p className="text-2xl font-bold text-green-400">99.8%</p>
        </div>
        <div className="flex-1 bg-white/60 dark:bg-black/30 border border-slate-900/10 dark:border-white/10 rounded-2xl flex items-center px-5 py-4 min-w-[250px]">
          <p className="text-slate-700 dark:text-white/70 text-sm font-medium truncate flex items-center gap-3">
             <ScanFace className="w-5 h-5 text-green-400" />
            {scanResult === 'success' && pegawaiData 
              ? `"Ananda ${pegawaiData.nama.split(' ')[0]} baru saja melakukan presensi."`
              : `"Sistem presensi biometrik cerdas siap digunakan."`}
          </p>
        </div>
      </div>
    </div>
  );
}
