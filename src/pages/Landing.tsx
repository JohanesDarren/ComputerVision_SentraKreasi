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
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#151413] text-[#2C2825] dark:text-[#EFEBE1] font-sans overflow-x-hidden selection:bg-[#386641] selection:text-white transition-colors duration-300">
      
      {/* Brutalist Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-brutalist-grid opacity-60"></div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-black/10 dark:border-white/10 ${scrolled ? 'bg-[#FAF8F5]/90 dark:bg-[#151413]/90 backdrop-blur-md py-4' : 'bg-transparent py-5'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Sentra Kreasi Logo" className="h-8 md:h-10 object-contain drop-shadow-sm" />
          </div>

          <div className="hidden md:flex items-center gap-10 text-[11px] font-bold tracking-[0.2em] uppercase">
            <a href="#hero" className="hover:text-[#386641] transition-colors">Utama</a>
            <a href="#fitur" className="hover:text-[#386641] transition-colors">Kapabilitas</a>
            <a href="#akses" className="hover:text-[#386641] transition-colors">Produk</a>
            <a href="#hubungi" className="hover:text-[#386641] transition-colors">Kontak</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center p-2 rounded-none border border-black/20 dark:border-white/20 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
               <ThemeToggle />
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="bg-[#2C2825] dark:bg-[#EFEBE1] text-[#FAF8F5] dark:text-[#151413] px-6 py-2.5 text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#386641] dark:hover:bg-[#386641] hover:text-white transition-colors">
              LOGIN
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 lg:pt-40 pb-20 max-w-[1400px] mx-auto px-6">
        
        {/* HERO SECTION */}
        <section id="hero" className="relative mb-32 border-b border-black/10 dark:border-white/10 pb-20">
          <div className="text-center md:text-left">
            <h1 className="font-[Bebas_Neue] text-[15vw] md:text-[180px] leading-[0.85] text-[#2C2825] dark:text-[#EFEBE1] uppercase tracking-tighter m-0 relative z-20 mix-blend-difference dark:mix-blend-normal">
              PRESENSI<br/>INTERNAL
            </h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12 md:mt-[-80px] relative z-10">
             <div className="md:col-span-5 md:mt-24">
                <p className="text-sm md:text-base font-medium max-w-sm mb-8 leading-relaxed border-l-4 border-[#386641] pl-4">
                  Efisiensi tanpa kehilangan sentuhan manusia. Sistem manajemen terpadu Sentra Kreasi menggunakan pengenalan wajah cerdas.
                </p>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-[#6B5A4B] text-white px-8 py-4 text-xs font-bold tracking-widest uppercase flex items-center gap-4 hover:bg-[#386641] transition-colors">
                  AKSES SISTEM <ArrowRight className="w-4 h-4" />
                </button>

                <div className="mt-12 flex items-center gap-6 text-[10px] uppercase font-bold tracking-widest opacity-60">
                   <div>TERSEDIA DI:<br/>SENTRAKREASI PUSAT</div>
                </div>
             </div>

             <div className="md:col-span-7 relative">
                <div className="w-full aspect-[4/3] md:aspect-auto md:h-[600px] bg-[#E5DCC5] dark:bg-[#2A2621] overflow-hidden relative group flex items-center justify-center border-l-8 md:border-l-[16px] md:border-t-[16px] border-[#2C2825] dark:border-[#151413]">
                   
                   {/* Background pattern inside the box */}
                   <div className="absolute inset-0 bg-brutalist-grid opacity-30 mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>

                   {/* Template Character (Neo-Brutalist Frame) */}
                   <div className="relative w-48 h-64 md:w-72 md:h-96 border-[6px] border-[#2C2825] dark:border-[#EFEBE1] bg-[#FAF8F5] dark:bg-[#1E1C1A] flex flex-col items-center justify-center p-6 group-hover:bg-[#EFEBE1] dark:group-hover:bg-[#2A2621] transition-colors duration-300">
                      
                      {/* Face Icon */}
                      <ScanFace className="w-24 h-24 md:w-32 md:h-32 text-[#2C2825] dark:text-[#EFEBE1] mb-8 stroke-1 group-hover:scale-110 transition-transform duration-500" />
                      
                      {/* Abstract details representing character profile */}
                      <div className="w-full space-y-3">
                         <div className="w-full flex gap-2">
                           <div className="h-3 md:h-4 bg-[#386641] w-2/3"></div>
                           <div className="h-3 md:h-4 bg-[#2C2825] dark:bg-[#EFEBE1] w-1/3"></div>
                         </div>
                         <div className="w-full flex gap-2">
                           <div className="h-3 md:h-4 bg-[#2C2825] dark:bg-[#EFEBE1] w-1/4"></div>
                           <div className="h-3 md:h-4 bg-[#A89886] dark:bg-[#6B5A4B] w-3/4 opacity-50"></div>
                         </div>
                      </div>

                      {/* Animated Scanning Line */}
                      <div className="absolute left-0 w-full h-1 bg-[#386641] animate-scanline"></div>
                   </div>

                   <div className="absolute bottom-6 right-6 flex gap-2 z-10">
                      <div className="w-12 h-12 bg-[#386641] rounded-none flex items-center justify-center border-[2px] border-[#2C2825] cursor-pointer hover:bg-[#2C2825] transition-colors">
                         <Play className="w-4 h-4 text-[#FAF8F5] fill-[#FAF8F5] ml-1" />
                      </div>
                      <div className="w-12 h-12 bg-white flex items-center justify-center border-[2px] border-[#2C2825] text-[#2C2825] cursor-pointer hover:bg-[#EFEBE1] transition-colors">
                         <Camera className="w-5 h-5" />
                      </div>
                   </div>
                </div>
                <div className="absolute -bottom-6 -right-6 md:right-[-40px] max-w-[200px] bg-white dark:bg-[#2C2825] p-5 border-[4px] border-[#2C2825] dark:border-[#EFEBE1] z-20">
                   <p className="text-[10px] font-bold tracking-widest uppercase mb-1">TINGKAT EFISIENSI</p>
                   <p className="text-xs font-medium text-[#6B5A4B] dark:text-[#A89886]">Elevasi kerja berdasarkan pengawasan presisi.</p>
                </div>
             </div>
          </div>
        </section>

        {/* FEATURE SECTION */}
        <section id="fitur" className="py-20 mb-20 border-b border-black/10 dark:border-white/10">
           <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 gap-6">
              <h2 className="font-[Bebas_Neue] text-6xl md:text-8xl leading-[0.9] tracking-tight uppercase">
                KAPABILITAS <br/> <span className="text-[#A89886] dark:text-[#6B5A4B]">TANPA BATAS</span>
              </h2>
              <button className="bg-[#6B5A4B] text-white px-6 py-2 text-[10px] font-bold tracking-[0.2em] uppercase shrink-0">
                JELAJAHI FITUR
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#EFEBE1] dark:bg-[#1E1C1A] p-8 relative overflow-hidden group">
                 <div className="absolute top-4 right-4 text-[#A89886] opacity-30 font-[Bebas_Neue] text-6xl">01</div>
                 <div className="w-20 h-20 bg-white dark:bg-[#2C2825] rounded-full flex items-center justify-center mb-10 border-[4px] border-[#2C2825] dark:border-[#EFEBE1] relative z-10 group-hover:scale-110 transition-transform">
                    <Eye className="w-8 h-8 text-[#386641]" />
                 </div>
                 <h3 className="font-[Bebas_Neue] text-3xl mb-3 tracking-wide">Pendeteksi Wajah</h3>
                 <p className="text-sm font-medium text-[#6B5A4B] dark:text-[#A89886] leading-relaxed">
                   Inovasi face recognition akurasi 99.8% memastikan yang hadir adalah karyawan otentik, memutus praktik titip absen seketika.
                 </p>
              </div>

              <div className="bg-[#EBE5DB] dark:bg-[#24211E] p-8 relative overflow-hidden group md:-translate-y-8">
                 <div className="absolute top-4 right-4 text-[#A89886] opacity-30 font-[Bebas_Neue] text-6xl">02</div>
                 <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mb-10 border-[4px] border-[#2C2825] dark:border-[#EFEBE1] relative z-10 group-hover:scale-110 transition-transform">
                    <Activity className="w-8 h-8" />
                 </div>
                 <h3 className="font-[Bebas_Neue] text-3xl mb-3 tracking-wide">Pemrosesan Cepat</h3>
                 <p className="text-sm font-medium text-[#6B5A4B] dark:text-[#A89886] leading-relaxed">
                   Verifikasi instan dalam hitungan detik. Mengurangi waktu antrian di pintu masuk dan mencegah penumpukan pegawai.
                 </p>
              </div>

              <div className="bg-[#E4DCCE] dark:bg-[#2A2621] p-8 relative overflow-hidden group md:-translate-y-16">
                 <div className="absolute top-4 right-4 text-[#A89886] opacity-30 font-[Bebas_Neue] text-6xl">03</div>
                 <div className="w-20 h-20 bg-[#386641] text-white rounded-full flex items-center justify-center mb-10 border-[4px] border-[#2C2825] dark:border-[#EFEBE1] relative z-10 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-8 h-8" />
                 </div>
                 <h3 className="font-[Bebas_Neue] text-3xl mb-3 tracking-wide">Liveness Anti-Spoof</h3>
                 <p className="text-sm font-medium text-[#6B5A4B] dark:text-[#A89886] leading-relaxed">
                   Sistem tak bisa dikelabui foto statis maupun topeng. Algoritma liveness secara aktif membedakan fisik asli dengan manipulasi.
                 </p>
              </div>
           </div>
        </section>

        {/* OVERVIEW SECTION */}
        <section className="py-20 mb-20 border-b border-black/10 dark:border-white/10" id="akses">
          <div className="flex justify-between border-b border-black/20 dark:border-white/20 pb-4 mb-10">
             <div className="font-bold text-xs tracking-widest uppercase">DETAIL TEKNIS — 03-2024</div>
             <div className="font-bold text-xs tracking-widest uppercase">PRODUK INTERNAL</div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div className="bg-[#EFEBE1] dark:bg-[#1E1C1A] aspect-square lg:aspect-auto lg:h-[600px] flex items-center justify-center relative p-8">
               <div className="absolute top-8 right-8 border border-black/20 dark:border-white/20 px-4 py-1 text-[10px] font-bold tracking-widest uppercase">SYSTEM CORE</div>
               <div className="w-[60%] h-[60%] bg-[#2C2825] dark:bg-black relative overflow-hidden group border-[6px] border-[#2C2825] dark:border-[#EFEBE1]">
                  <div className="absolute inset-0 bg-brutalist-grid opacity-20"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#386641] rounded-full group-hover:scale-150 transition-transform duration-700 blur-[2px]"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full"></div>
                  <div className="absolute bottom-4 left-4 flex gap-1">
                     {[...Array(6)].map((_, i) => (
                       <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#386641] animate-pulse" style={{animationDelay: `${i * 0.2}s`}}></div>
                     ))}
                  </div>
               </div>
             </div>

             <div className="max-w-md">
                <h2 className="font-[Bebas_Neue] text-6xl leading-[0.9] tracking-tight uppercase mb-8">
                  DIRANCANG UNTUK<br/>MANUSIA DENGAN<br/>PRESISI MESIN
                </h2>
                
                <div className="mb-10">
                   <h4 className="font-bold text-sm tracking-wide mb-2 uppercase">Kualitas Otentikasi</h4>
                   <p className="text-sm text-[#6B5A4B] dark:text-[#A89886] leading-relaxed">
                     Pengenalan sudut ekspansi tinggi, bekerja dalam kondisi cahaya minim, terkalibrasi untuk berbagai jenis wajah staf di lingkungan Sentra Kreasi.
                   </p>
                </div>

                <div className="mb-10">
                   <h4 className="font-bold text-sm tracking-wide mb-2 uppercase">Sinkronisasi Cloud</h4>
                   <p className="text-sm text-[#6B5A4B] dark:text-[#A89886] leading-relaxed">
                     Data terkirim real-time ke pusat kontrol admin di Kampung Digital. Aman, tidak tersentuh, tanpa latensi.
                   </p>
                </div>
             </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-20" id="hubungi">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
             <a href="https://instagram.com/sentrakreasi.ukm" target="_blank" rel="noopener noreferrer" className="bg-[#EFEBE1] dark:bg-[#1E1C1A] p-10 flex flex-col items-center justify-center text-center hover:bg-[#386641] hover:text-white dark:hover:bg-[#386641] transition-colors group">
               <Instagram className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
               <h3 className="font-[Bebas_Neue] text-3xl tracking-wide mb-1">Instagram</h3>
               <p className="text-xs font-bold font-sans tracking-widest uppercase opacity-60">@sentrakreasi.ukm</p>
             </a>

             <a href="https://maps.google.com/?q=Sentrakreasi+Bandung+-7.0145892,107.595449" target="_blank" rel="noopener noreferrer" className="bg-[#EFEBE1] dark:bg-[#1E1C1A] p-10 flex flex-col items-center justify-center text-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors group">
               <MapPin className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
               <h3 className="font-[Bebas_Neue] text-3xl tracking-wide mb-1">LOKASI KAMI</h3>
               <p className="text-xs font-bold font-sans tracking-widest uppercase opacity-60">Buka Di Peta</p>
             </a>

             <a href="tel:+6289611284382" className="bg-[#EFEBE1] dark:bg-[#1E1C1A] p-10 flex flex-col items-center justify-center text-center hover:bg-[#A89886] hover:text-white dark:hover:bg-[#6B5A4B] transition-colors group">
               <Phone className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
               <h3 className="font-[Bebas_Neue] text-3xl tracking-wide mb-1">TELEPON</h3>
               <p className="text-xs font-bold font-sans tracking-widest uppercase opacity-60">0896-1128-4382</p>
             </a>

             <a href="mailto:sentrakreasibandung@gmail.com" className="bg-[#EFEBE1] dark:bg-[#1E1C1A] p-10 flex flex-col items-center justify-center text-center hover:bg-[#6B5A4B] hover:text-white dark:hover:bg-[#A89886] dark:hover:text-black transition-colors group">
               <Mail className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
               <h3 className="font-[Bebas_Neue] text-3xl tracking-wide mb-1">EMAIL TIKET</h3>
               <p className="text-xs font-bold font-sans tracking-widest uppercase opacity-60">Bantuan Support</p>
             </a>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center border-t border-black/20 dark:border-white/20 pt-10 pb-6 gap-6">
             <img src="/logo.png" alt="Sentra Kreasi Logo" className="h-10 md:h-12 object-contain" />
             <p className="text-[10px] font-bold tracking-widest uppercase">&copy; {new Date().getFullYear()} Hak Cipta Sistem Internal SentraKreasi</p>
          </div>
        </footer>

        {/* Floating WhatsApp Action Button */}
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group">
           <div className="bg-black text-white text-[10px] font-bold tracking-widest uppercase px-4 py-2 opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
             CHAT DENGAN ADMIN
           </div>
           <a href="https://wa.me/6289611284382" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-[#386641] hover:bg-[#6B5A4B] text-white rounded-none flex items-center justify-center transition-all hover:scale-105">
              <MessageCircle className="w-6 h-6" />
           </a>
        </div>

      </main>
    </div>
  );
}
