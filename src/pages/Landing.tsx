import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Play, Camera, MapPin, Instagram, Phone, Mail, MessageCircle, Eye, Activity, ScanFace } from 'lucide-react';
import { useEffect, useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';

export default function Landing() {
 const navigate = useNavigate();
 const [scrolled, setScrolled] = useState(false);

 useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 20);
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 return (
  <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] via-[#f0fdf4] to-[#ffffff] dark:from-[#020617] dark:via-[#022c22] dark:to-[#000000] text-slate-800 dark:text-white font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-white transition-colors duration-500">
   
   {/* Rich Glowing Background Orbs (Not just green anymore) */}
   <div className="fixed inset-0 z-0 pointer-events-none">
     <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-400/30 dark:bg-emerald-500/20 rounded-full blur-[120px] opacity-60 mix-blend-screen"></div>
     <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-cyan-400/30 dark:bg-cyan-900/40 rounded-full blur-[150px] opacity-50 mix-blend-screen"></div>
     <div className="absolute top-1/2 left-1/2 w-[800px] h-[400px] bg-blue-300/20 dark:bg-indigo-900/20 rounded-full blur-[160px] opacity-40 mix-blend-screen"></div>
   </div>

   {/* Navbar */}
   <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-slate-900/5 dark:border-white/5 ${scrolled ? 'bg-white/80 dark:bg-[#021811]/80 py-4 shadow-lg' : 'bg-transparent py-5'}`}>
    <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
     <div className="flex items-center gap-2">
      <img src="/logo.png" alt="Sentra Kreasi Logo" className="h-8 md:h-10 object-contain drop-shadow-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] dark:drop-shadow-sm brightness-110 dark:brightness-200" />
     </div>

     <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600 dark:text-white/70">
      <a href="#hero" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Utama</a>
      <a href="#fitur" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Kapabilitas</a>
      <a href="#akses" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Produk</a>
      <a href="#hubungi" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Kontak</a>
     </div>

     <div className="flex items-center gap-4">
      <div className="hidden sm:flex p-1 bg-white/50 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10 ">
       <ThemeToggle />
      </div>
      <button 
       onClick={() => navigate('/login')}
       className="bg-white/90 dark:bg-white/5 shadow-md dark:shadow-none border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 text-slate-800 dark:text-white px-6 py-2 rounded-full text-sm font-semibold transition-all ">
       Login
      </button>
      <button 
       onClick={() => navigate('/presensi-cepat')}
       className="bg-emerald-500 hover:bg-emerald-600 dark:hover:bg-emerald-400 text-slate-900 dark:text-white dark:text-black px-6 py-2 rounded-full text-sm font-bold shadow-[0_4px_20px_rgba(16,185,129,0.3)] dark:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
       Quick Presence
      </button>
     </div>
    </div>
   </nav>

   <main className="relative z-10 pt-32 lg:pt-48 pb-20 max-w-[1200px] mx-auto px-6">
    
    {/* HERO SECTION */}
    <section id="hero" className="relative mb-32 pb-20 flex flex-col items-center text-center">
     <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold mb-8 shadow-sm ">
       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
       AI Biometrics Engine V2.0
     </div>
     
     <h1 className="text-5xl md:text-7xl lg:text-[80px] font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 mb-6 max-w-4xl">
      Sistem Presensi Wajah <br/> Staff Sentra Kreasi
     </h1>
     
     <p className="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-300 max-w-2xl mb-10 leading-relaxed">
      Efisiensi tanpa kehilangan sentuhan manusia. Sistem manajemen terpadu Sentra Kreasi menggunakan kecerdasan buatan untuk absensi yang presisi dan instan.
     </p>
     
     <div className="flex flex-col sm:flex-row items-center gap-4">
       <button 
        onClick={() => navigate('/presensi-cepat')}
        className="bg-emerald-500 text-slate-900 dark:text-white dark:text-black px-8 py-4 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-emerald-600 dark:hover:bg-emerald-400 shadow-[0_4px_30px_rgba(16,185,129,0.4)] dark:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-105 transition-all">
        Mulai Sekarang <ArrowRight className="w-4 h-4" />
       </button>
     </div>
    </section>

    {/* FEATURE SECTION */}
    <section id="fitur" className="py-20 mb-20 relative">
      <div className="text-center mb-16">
       <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">Kapabilitas Tanpa Batas</h2>
       <p className="text-slate-600 font-medium dark:text-slate-400 max-w-xl mx-auto">Kami menginvestasikan teknologi canggih untuk mengubah cara Anda berinteraksi dengan manajemen kehadiran.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div className="bg-white/80 dark:bg-white/5 shadow-sm dark:shadow-none border border-slate-200/60 dark:border-white/10 p-8 rounded-3xl hover:bg-white dark:hover:bg-white/10 transition-all group">
         <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-8 border border-emerald-200 dark:border-emerald-500/30 group-hover:scale-110 transition-transform shadow-sm dark:shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <Eye className="w-7 h-7" />
         </div>
         <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white/90">Pendeteksi Wajah</h3>
         <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
          Inovasi face recognition akurasi 99.8% memastikan yang hadir adalah karyawan otentik, memutus praktik titip absen seketika.
         </p>
       </div>

       <div className="bg-gradient-to-b from-blue-50/80 to-white/80 dark:from-emerald-500/10 dark:to-transparent border border-blue-200 dark:border-emerald-500/20 p-8 rounded-3xl hover:border-blue-300 dark:hover:border-emerald-500/40 shadow-sm dark:shadow-none transition-all group relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/50 dark:bg-emerald-500/20 blur-3xl -z-10 group-hover:bg-blue-300/50 dark:group-hover:bg-emerald-500/30 transition-all"></div>
         <div className="w-14 h-14 bg-emerald-500 text-slate-900 dark:text-white dark:text-black rounded-2xl flex items-center justify-center mb-8 shadow-[0_4px_20px_rgba(16,185,129,0.4)] dark:shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">
          <Activity className="w-7 h-7" />
         </div>
         <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Pemrosesan Cepat</h3>
         <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
          Verifikasi instan dalam hitungan detik. Mengurangi waktu antrian di pintu masuk dan mencegah penumpukan pegawai.
         </p>
       </div>

       <div className="bg-white/80 dark:bg-white/5 shadow-sm dark:shadow-none border border-slate-200/60 dark:border-white/10 p-8 rounded-3xl hover:bg-white dark:hover:bg-white/10 transition-all group">
         <div className="w-14 h-14 bg-slate-100 dark:bg-white/10 shadow-sm dark:shadow-none text-slate-700 dark:text-white/80 rounded-2xl flex items-center justify-center mb-8 border border-slate-200 dark:border-white/10 group-hover:scale-110 transition-transform">
          <ShieldCheck className="w-7 h-7" />
         </div>
         <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white/90">Liveness Anti-Spoof</h3>
         <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
          Sistem tak bisa dikelabui foto statis maupun topeng. Algoritma liveness secara aktif membedakan fisik asli dengan manipulasi.
         </p>
       </div>
      </div>
    </section>

    {/* OVERVIEW SECTION */}
    <section className="py-20 mb-20 relative" id="akses">
     <div className="bg-white/90 dark:bg-white/5 shadow-2xl dark:shadow-none border border-slate-200/60 dark:border-white/10 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
       <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-400/20 dark:bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none"></div>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">Dirancang untuk<br/>Presisi & Keamanan</h2>
          <p className="text-slate-600 font-medium dark:text-slate-400 mb-10 leading-relaxed">Sistem cerdas kami tidak hanya mengenali wajah, tapi mengerti keamanan tingkat tinggi untuk data instansi Anda.</p>
          
          <div className="space-y-8">
           <div className="flex gap-4">
             <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 shadow-sm dark:shadow-none flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/10">
              <ScanFace className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
             </div>
             <div>
              <h4 className="font-bold text-slate-800 dark:text-white mb-1">Kualitas Otentikasi Tinggi</h4>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Mengenali dalam cahaya minim dan menyesuaikan perubahan visual wajah.</p>
             </div>
           </div>
           <div className="flex gap-4">
             <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 shadow-sm dark:shadow-none flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/10">
              <MapPin className="w-5 h-5 text-cyan-500 dark:text-emerald-400" />
             </div>
             <div>
              <h4 className="font-bold text-slate-800 dark:text-white mb-1">Sinkronisasi Real-Time</h4>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Data masuk detik itu juga ke dashboard admin dengan sistem berbasis cloud yang aman.</p>
             </div>
           </div>
          </div>
        </div>

        <div className="relative aspect-square md:aspect-video lg:aspect-square w-full bg-slate-50 dark:bg-black/40 shadow-inner dark:shadow-none rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden flex items-center justify-center group">
          <div className="w-48 h-48 rounded-full border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center relative">
           <div className="absolute inset-0 rounded-full border border-emerald-200 dark:border-emerald-500/10 scale-150 animate-ping" style={{animationDuration: '3s'}}></div>
           <div className="absolute inset-0 rounded-full border border-emerald-300/50 dark:border-emerald-500/20 scale-125 animate-ping" style={{animationDuration: '2s'}}></div>
           <ScanFace className="w-16 h-16 text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
        </div>
       </div>
     </div>
    </section>

    {/* FOOTER */}
    <footer className="pt-20 border-t border-slate-200 dark:border-white/10" id="hubungi">
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
       <a href="https://instagram.com/sentrakreasi.ukm" target="_blank" rel="noopener noreferrer" className="bg-white/80 dark:bg-white/5 shadow-md dark:shadow-none border border-slate-200/60 dark:border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-white dark:hover:bg-white/10 transition-all group ">
        <Instagram className="w-8 h-8 mb-4 text-slate-500 dark:text-white/60 group-hover:text-emerald-500 transition-colors" />
        <h3 className="font-bold mb-1 text-slate-800 dark:text-white/90">Instagram</h3>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">@sentrakreasi.ukm</p>
       </a>

       <a href="https://maps.google.com/?q=Sentrakreasi+Bandung+-7.0145892,107.595449" target="_blank" rel="noopener noreferrer" className="bg-white/80 dark:bg-white/5 shadow-md dark:shadow-none border border-slate-200/60 dark:border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-white dark:hover:bg-white/10 transition-all group ">
        <MapPin className="w-8 h-8 mb-4 text-slate-500 dark:text-white/60 group-hover:text-emerald-500 transition-colors" />
        <h3 className="font-bold mb-1 text-slate-800 dark:text-white/90">Lokasi Kami</h3>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Buka Di Peta</p>
       </a>

       <a href="tel:+6289611284382" className="bg-white/80 dark:bg-white/5 shadow-md dark:shadow-none border border-slate-200/60 dark:border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-white dark:hover:bg-white/10 transition-all group ">
        <Phone className="w-8 h-8 mb-4 text-slate-500 dark:text-white/60 group-hover:text-emerald-500 transition-colors" />
        <h3 className="font-bold mb-1 text-slate-800 dark:text-white/90">Telepon</h3>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">0896-1128-4382</p>
       </a>

       <a href="mailto:sentrakreasibandung@gmail.com" className="bg-white/80 dark:bg-white/5 shadow-md dark:shadow-none border border-slate-200/60 dark:border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-white dark:hover:bg-white/10 transition-all group ">
        <Mail className="w-8 h-8 mb-4 text-slate-500 dark:text-white/60 group-hover:text-emerald-500 transition-colors" />
        <h3 className="font-bold mb-1 text-slate-800 dark:text-white/90">Email</h3>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Bantuan Support</p>
       </a>
     </div>

     <div className="flex flex-col md:flex-row justify-between items-center pt-8 pb-8 gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
       <img src="/logo.png" alt="Sentra Kreasi Logo" className="h-8 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] dark:drop-shadow-sm brightness-110 dark:brightness-200 opacity-80" />
       <p>&copy; {new Date().getFullYear()} SentraKreasi. All rights reserved.</p>
     </div>
    </footer>

    {/* Floating WhatsApp Action Button */}
    <div className="fixed bottom-8 right-8 z-50 flex items-center gap-4 group">
      <div className="bg-white dark:bg-white/10 shadow-lg dark:shadow-none border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-xs font-bold px-4 py-2 rounded-full opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
       Chat dengan Admin
      </div>
      <a href="https://wa.me/6289611284382" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-emerald-500 text-slate-900 dark:text-white dark:text-black rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(16,185,129,0.4)] dark:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-110">
       <MessageCircle className="w-6 h-6" />
      </a>
    </div>

   </main>
  </div>
 );
}
