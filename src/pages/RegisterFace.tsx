import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, CheckCircle, RefreshCw, Upload, AlertCircle, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { registerFace } from '../lib/api';

export default function RegisterFace() {
  const webcamRef = useRef<Webcam>(null);
  
  const [formData, setFormData] = useState({ nama: '', nip: '' });
  const [capturedImages, setCapturedImages] = useState<{depan: string|null, kiri: string|null, kanan: string|null}>({
    depan: null,
    kiri: null,
    kanan: null
  });
  const [activeAngle, setActiveAngle] = useState<'depan'|'kiri'|'kanan'>('depan');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{type: 'success'|'error'|'info', text: string} | null>(null);

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImages(prev => ({ ...prev, [activeAngle]: imageSrc }));
      if (activeAngle === 'depan') setActiveAngle('kiri');
      else if (activeAngle === 'kiri') setActiveAngle('kanan');
    }
  };

  const handleRegister = async () => {
    if (!formData.nama || !formData.nip) {
      setStatusMsg({ type: 'error', text: 'Nama dan NIP harus diisi!' });
      return;
    }
    if (!capturedImages.depan || !capturedImages.kiri || !capturedImages.kanan) {
      setStatusMsg({ type: 'error', text: 'Anda harus menangkap 3 sisi wajah (Depan, Kiri, Kanan).' });
      return;
    }

    setIsProcessing(true);
    setStatusMsg({ type: 'info', text: '1/2 Mengecek & menyimpan data pegawai...' });

    try {
      // 1. Cek NIP atau insert ke Supabase
      let pegawaiId = '';
      const { data: existingData, error: checkErr } = await supabase.from('pegawai').select('id').eq('nip', formData.nip).single();
      
      if (existingData) {
        pegawaiId = existingData.id;
        setStatusMsg({ type: 'info', text: 'NIP ditemukan. 2/2 Memproses pembaruan wajah ke AI...' });
      } else {
        const { data: insertedData, error: insertErr } = await supabase.from('pegawai').insert([{ nama: formData.nama, nip: formData.nip }]).select().single();
        if (insertErr || !insertedData) throw new Error(insertErr?.message || 'Gagal membuat data pegawai.');
        pegawaiId = insertedData.id;
        setStatusMsg({ type: 'info', text: 'Pegawai baru disimpan. 2/2 Memproses wajah ke AI...' });
      }

      // 2. Kirim ke FastAPI
      const images = [capturedImages.depan, capturedImages.kiri, capturedImages.kanan];
      await registerFace(pegawaiId, images);
      
      setStatusMsg({ type: 'success', text: `Berhasil! Wajah untuk ${formData.nama} telah didaftarkan dan dioptimasi dari 3 sudut.` });
      
      // Reset
      setFormData({ nama: '', nip: '' });
      setCapturedImages({ depan: null, kiri: null, kanan: null });
      setActiveAngle('depan');
      
    } catch (err: any) {
      console.error(err);
      setStatusMsg({ type: 'error', text: err.message || 'Terjadi kesalahan saat mendaftarkan wajah.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full p-4 md:p-8">
      <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-6 mb-6">
        <h1 className="font-[Bebas_Neue] text-5xl tracking-wide uppercase text-[#2C2825] dark:text-[#EFEBE1]">Pendaftaran Wajah Baru</h1>
        <p className="text-[10px] font-bold text-[#6B5A4B] dark:text-[#A89886] uppercase tracking-widest mt-2 border-t-[3px] border-[#2C2825] dark:border-[#EFEBE1] pt-4">Sistem 3 Sudut (Depan, Kiri, Kanan) untuk akurasi presensi tertinggi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Kolom Kiri: Form & Kamera */}
        <div className="space-y-6">
          <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-6 space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1] block mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                value={formData.nama}
                onChange={e => setFormData({ ...formData, nama: e.target.value })}
                className="w-full bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] p-3 font-bold text-[#2C2825] dark:text-[#EFEBE1] focus:outline-none" 
                placeholder="CONTOH: BUDI CAHYONO"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1] block mb-2">NIP / ID Unik</label>
              <input 
                type="text" 
                value={formData.nip}
                onChange={e => setFormData({ ...formData, nip: e.target.value })}
                className="w-full bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] p-3 font-bold text-[#2C2825] dark:text-[#EFEBE1] focus:outline-none" 
                placeholder="CONTOH: 607012..."
              />
            </div>
          </div>

          <div className="bg-[#EFEBE1] dark:bg-[#1E1C1A] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-2 relative aspect-[4/3]">
             <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="object-cover w-full h-full"
                videoConstraints={{ facingMode: "user" }}
             />
             <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <span className="bg-[#FAF8F5] text-[#2C2825] border-[2px] border-[#2C2825] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Kamera Registrasi</span>
                <button 
                  onClick={handleCapture}
                  className="bg-[#386641] text-slate-900 dark:text-white border-[2px] border-[#2C2825] px-4 py-2 text-xs font-bold uppercase hover:bg-[#2C2825] transition-colors flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" /> Tangkap Sisi {activeAngle.toUpperCase()}
                </button>
             </div>
          </div>
        </div>

        {/* Kolom Kanan: Preview Sudut */}
        <div className="space-y-6 flex flex-col">
          <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-6 flex-1 flex flex-col">
             <h3 className="font-[Bebas_Neue] text-3xl text-[#2C2825] dark:text-[#EFEBE1] uppercase border-b-[3px] border-[#2C2825] dark:border-[#EFEBE1] pb-4 mb-6">Pratinjau 3 Sudut Wajah</h3>
             
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
                         <h4 className="font-[Bebas_Neue] text-2xl text-[#2C2825] dark:text-[#EFEBE1] uppercase">Sisi {angle}</h4>
                         <p className="text-[10px] font-bold uppercase text-[#6B5A4B] dark:text-[#A89886]">
                            {capturedImages[angle] ? 'Tertangkap' : 'Menunggu Kamera'}
                         </p>
                      </div>
                      {capturedImages[angle] && (
                         <button onClick={() => {
                            setCapturedImages(prev => ({...prev, [angle]: null}));
                            setActiveAngle(angle);
                         }} className="p-2 bg-[#E36D4F] text-slate-900 dark:text-white border-[2px] border-[#2C2825] hover:bg-[#2C2825]">
                            <Trash2 className="w-4 h-4" />
                         </button>
                      )}
                   </div>
                ))}
             </div>

             {statusMsg && (
                <div className={`mt-6 p-4 border-[3px] border-[#2C2825] text-xs font-bold uppercase tracking-widest flex items-center gap-3 ${
                   statusMsg.type === 'success' ? 'bg-[#386641] text-white' : 
                   statusMsg.type === 'error' ? 'bg-[#E36D4F] text-white' : 
                   'bg-[#EFEBE1] text-[#2C2825]'
                }`}>
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
                   : 'bg-[#386641] text-slate-900 dark:text-white hover:bg-[#2C2825]'
                }`}
             >
                {isProcessing ? <><RefreshCw className="w-6 h-6 animate-spin mt-1" /> Sedang Memproses</> : <><Upload className="w-6 h-6 mt-1" /> Daftarkan Wajah</>}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
