import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Smile, Target, BatteryMedium, Meh, Frown, ScanFace, LucideIcon, ScanLine } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';

export default function Presensi() {
  const webcamRef = useRef<Webcam>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);
  const [expression, setExpression] = useState<{ icon: LucideIcon, label: string } | null>(null);

  const handleCapture = useCallback(async () => {
    setIsScanning(true);
    setScanResult(null);
    setExpression(null);
    
    const imageSrc = webcamRef.current?.getScreenshot();
    
    if (!imageSrc) {
      setIsScanning(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const base64Data = imageSrc.split(',')[1];

      const response = await ai.models.generateContent({
         model: 'gemini-2.5-flash',
         contents: [
           {
             role: 'user',
             parts: [
               { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
               { text: 'Analisis ekspresi wajah pada gambar ini. Pilih salah satu kata paling DOMINAN untuk mewakilinya: Ceria, Fokus, Netral, Lelah, Sedih, atau TakTerdeteksi. Jawab HANYA DENGAN SATU KATA tersebut tanpa tanda baca lain.' }
             ]
           }
         ]
      });
      
      const expressionText = response.text().trim() || 'Netral';
      
      let Icon = Meh;
      let label = expressionText;
      
      if (expressionText.includes('Ceria')) { Icon = Smile; label = 'Ceria'; }
      else if (expressionText.includes('Fokus')) { Icon = Target; label = 'Fokus'; }
      else if (expressionText.includes('Lelah')) { Icon = BatteryMedium; label = 'Lelah'; }
      else if (expressionText.includes('Sedih')) { Icon = Frown; label = 'Sedih'; }
      else if (expressionText.includes('Tak')) { Icon = ScanFace; label = 'Tidak Terdeteksi'; }

      setExpression({ icon: Icon, label });
      setScanResult('success');
      
    } catch(err) {
      console.error('Error with AI generation:', err);
      setScanResult('error');
    } finally {
      setIsScanning(false);
      setTimeout(() => setScanResult(null), 5000);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-4 bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-6">
        <h1 className="font-[Bebas_Neue] text-5xl tracking-wide uppercase text-[#2C2825] dark:text-[#EFEBE1]">Biometrik Cerdas</h1>
        <p className="text-[10px] font-bold text-[#6B5A4B] dark:text-[#A89886] uppercase tracking-widest mt-2 border-t-[3px] border-[#2C2825] dark:border-[#EFEBE1] pt-4">Arahkan wajah ke kamera, AI akan mendeteksi ekspresi Anda.</p>
      </div>

      <div className="relative overflow-hidden bg-[#EFEBE1] dark:bg-[#1E1C1A] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] aspect-[4/3] md:aspect-[16/9] isolate flex items-center justify-center">
        {/* Brutalist Frame Background for Cam */}
        <div className="absolute inset-0 bg-brutalist-grid opacity-20 pointer-events-none"></div>
        
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="object-cover w-full h-full absolute inset-0 -z-10 opacity-90 dark:opacity-80 grayscale mix-blend-multiply dark:mix-blend-luminosity"
          videoConstraints={{ facingMode: "user" }}
        />

        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none flex-col">
          <div className="relative flex items-center justify-center">
            
            <div className="absolute w-[280px] h-[280px] md:w-[360px] md:h-[360px] border-[4px] border-[#386641] rounded-none flex items-center justify-center">
               <div className="w-[140px] h-[4px] md:w-[180px] bg-[#386641] absolute rotate-45"></div>
               <div className="w-[140px] h-[4px] md:w-[180px] bg-[#386641] absolute -rotate-45"></div>
            </div>

            <div className="relative w-56 h-56 md:w-72 md:h-72 border-[4px] border-[#386641] bg-[#FAF8F5]/20 dark:bg-[#151413]/20 flex flex-col justify-between p-2">
              <div className="flex justify-between">
                <div className="w-8 h-8 border-t-[4px] border-l-[4px] border-[#386641]"></div>
                <div className="w-8 h-8 border-t-[4px] border-r-[4px] border-[#386641]"></div>
              </div>
              
              {isScanning && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#386641] animate-scanline flex justify-center"></div>
              )}
              
              {!isScanning && !scanResult && (
                 <div className="self-center flex items-center gap-2 bg-[#FAF8F5] dark:bg-[#2A2621] px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-[#E36D4F] border-[2px] border-[#2C2825] dark:border-[#EFEBE1]">
                   <ScanLine className="w-4 h-4" /> Area Pindai Wajah
                 </div>
              )}
              {isScanning && (
                 <div className="self-center flex items-center gap-2 bg-[#386641] px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-white border-[2px] border-[#2C2825] animate-pulse">
                   <RefreshCw className="w-4 h-4 animate-spin" /> Menganalisis...
                 </div>
              )}

              <div className="flex justify-between mt-auto">
                <div className="w-8 h-8 border-b-[4px] border-l-[4px] border-[#386641]"></div>
                <div className="w-8 h-8 border-b-[4px] border-r-[4px] border-[#386641]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 inset-x-0 z-30 px-6 md:px-8 flex flex-col justify-end gap-4 md:flex-row md:justify-between md:items-end">
          <div className="bg-[#FAF8F5] dark:bg-[#2A2621] p-4 border-[3px] border-[#2C2825] dark:border-[#EFEBE1] max-w-[200px]">
            <p className="text-[#6B5A4B] dark:text-[#A89886] text-[10px] font-bold uppercase tracking-widest mb-1">Sensor Biometrik</p>
            <h2 className="text-[#2C2825] dark:text-[#EFEBE1] font-[Bebas_Neue] text-2xl tracking-wide flex items-center gap-2"><div className="w-3 h-3 bg-[#386641] border border-[#2C2825] animate-pulse"></div>Kamera Aktif</h2>
          </div>
          <button
            onClick={handleCapture}
            disabled={isScanning || scanResult === 'success'}
            className={cn(
              "flex items-center justify-center gap-3 px-6 py-4 md:px-8 md:py-4 font-[Bebas_Neue] text-3xl tracking-wider uppercase transition-colors border-[3px] border-[#2C2825] dark:border-[#EFEBE1]",
              isScanning 
                ? "bg-[#EFEBE1] dark:bg-[#1E1C1A] text-[#A89886] cursor-not-allowed" 
                : "bg-[#386641] text-white hover:bg-[#6B5A4B]"
            )}
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin mt-1" />
                <span className="mt-1">Memproses...</span>
              </>
            ) : (
              <>
                <Camera className="w-6 h-6 mt-1" />
                <span className="mt-1">Pindai Wajah</span>
              </>
            )}
          </button>
        </div>

        <AnimatePresence>
          {scanResult === 'success' && expression && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-6 left-6 right-6 z-30 flex justify-center"
            >
              <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-5 md:p-6 flex items-center gap-5 text-left w-full max-w-md">
                <div className="w-16 h-16 bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] flex items-center justify-center text-[#386641] shrink-0">
                   <expression.icon className="w-8 h-8" />
                </div>
                <div>
                   <h3 className="font-[Bebas_Neue] text-3xl text-[#2C2825] dark:text-[#EFEBE1] uppercase">Presensi Tercatat</h3>
                   <p className="text-[10px] font-bold text-[#6B5A4B] dark:text-[#A89886] uppercase tracking-widest mt-1">
                     Data terverifikasi.<br/> Ekspresi: <span className="text-[#386641]">{expression.label}</span>.
                   </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] p-5 flex items-center gap-6 overflow-x-auto transition-colors">
        <div className="px-4 border-r-[3px] border-[#2C2825] dark:border-[#EFEBE1] whitespace-nowrap">
          <p className="text-[10px] font-bold text-[#6B5A4B] dark:text-[#A89886] uppercase tracking-widest mb-1">Total Hadir</p>
          <p className="font-[Bebas_Neue] text-4xl text-[#2C2825] dark:text-[#EFEBE1] leading-none">45 <span className="text-[#A89886] text-xl">/ 50</span></p>
        </div>
        <div className="flex -space-x-4 overflow-visible shrink-0 items-center pl-2">
          <div className="h-12 w-12 bg-[#386641] flex items-center justify-center font-bold text-xs text-white border-[2px] border-[#2C2825] dark:border-[#EFEBE1]">SA</div>
          <div className="h-12 w-12 bg-[#386641] flex items-center justify-center font-bold text-xs text-white border-[2px] border-[#2C2825] dark:border-[#EFEBE1]">BC</div>
          <div className="h-12 w-12 bg-[#E36D4F] flex items-center justify-center font-bold text-xs text-white border-[2px] border-[#2C2825] dark:border-[#EFEBE1]">LS</div>
          <div className="flex items-center justify-center h-12 w-12 bg-[#EFEBE1] dark:bg-[#1E1C1A] text-xs font-bold text-[#2C2825] dark:text-[#EFEBE1] border-[2px] border-[#2C2825] dark:border-[#EFEBE1]">+42</div>
        </div>
        <div className="flex-1 bg-[#EFEBE1] dark:bg-[#151413] border-[3px] border-[#2C2825] dark:border-[#EFEBE1] flex items-center px-5 py-3 md:py-4 min-w-[250px]">
          <p className="text-[#2C2825] dark:text-[#EFEBE1] text-[10px] font-bold uppercase tracking-widest truncate">"Ananda Budi baru saja presensi dengan ekspresi ceria."</p>
        </div>
      </div>
    </div>
  );
}
