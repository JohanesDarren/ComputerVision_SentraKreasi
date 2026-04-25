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
    <div className="min-h-screen bg-[#030712] text-white font-sans overflow-x-hidden selection:bg-green-500 selection:text-white transition-colors duration-300">
      
      {/* Glow Effects Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-green-500/20 rounded-full blur-[120px] opacity-60 mix-blend-screen"></div>
         <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-green-900/30 rounded-full blur-[150px] opacity-40 mix-blend-screen"></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/5 ${scrolled ? 'bg-[#030712]/80 backdrop-blur-xl py-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)]' : 'bg-transparent py-5'}`}>
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Sentra Kreasi Logo" className="h-8 md:h-10 object-contain drop-shadow-sm brightness-200" />
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm font-medium text-white/70">
            <a href="#hero" className="hover:text-white transition-colors">Utama</a>
            <a href="#fitur" className="hover:text-white transition-colors">Kapabilitas</a>
            <a href="#akses" className="hover:text-white transition-colors">Produk</a>
            <a href="#hubungi" className="hover:text-white transition-colors">Kontak</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="bg-white/10 border border-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-md">
              Login
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="bg-green-500 hover:bg-green-400 text-black px-6 py-2 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all">
              Mulai Sekarang
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 lg:pt-48 pb-20 max-w-[1200px] mx-auto px-6">
        
        {/* HERO SECTION */}
        <section id="hero" className="relative mb-32 pb-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-8">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             AI Biometrics Engine V2.0
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-6 max-w-4xl">
            Sistem Presensi Wajah <br/> Masa Depan
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed">
            Efisiensi tanpa kehilangan sentuhan manusia. Sistem manajemen terpadu Sentra Kreasi menggunakan kecerdasan buatan untuk absensi yang presisi dan instan.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
             <button 
                onClick={() => navigate('/login')}
                className="bg-green-500 text-black px-8 py-4 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-green-400 shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(34,197,94,0.6)] hover:scale-105 transition-all">
                Akses Sistem <ArrowRight className="w-4 h-4" />
             </button>
             <button 
                className="px-8 py-4 rounded-full text-sm font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md transition-all">
                Pelajari Lebih Lanjut
             </button>
          </div>
        </section>

        {/* FEATURE SECTION */}
        <section id="fitur" className="py-20 mb-20 relative">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Kapabilitas Tanpa Batas</h2>
              <p className="text-white/50 max-w-xl mx-auto">Kami menginvestasikan teknologi canggih untuk mengubah cara Anda berinteraksi dengan manajemen kehadiran.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl hover:bg-white/[0.08] transition-all group">
                 <div className="w-14 h-14 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mb-8 border border-green-500/30 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                    <Eye className="w-7 h-7" />
                 </div>
                 <h3 className="text-xl font-semibold mb-3 text-white/90">Pendeteksi Wajah</h3>
                 <p className="text-sm text-white/50 leading-relaxed">
                   Inovasi face recognition akurasi 99.8% memastikan yang hadir adalah karyawan otentik, memutus praktik titip absen seketika.
                 </p>
              </div>

              <div className="bg-gradient-to-b from-green-500/10 to-transparent border border-green-500/20 p-8 rounded-3xl backdrop-blur-xl hover:border-green-500/40 transition-all group relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 blur-3xl -z-10 group-hover:bg-green-500/30 transition-all"></div>
                 <div className="w-14 h-14 bg-green-500 text-black rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(34,197,94,0.4)] group-hover:scale-110 transition-transform">
                    <Activity className="w-7 h-7" />
                 </div>
                 <h3 className="text-xl font-semibold mb-3 text-white">Pemrosesan Cepat</h3>
                 <p className="text-sm text-white/60 leading-relaxed">
                   Verifikasi instan dalam hitungan detik. Mengurangi waktu antrian di pintu masuk dan mencegah penumpukan pegawai.
                 </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl hover:bg-white/[0.08] transition-all group">
                 <div className="w-14 h-14 bg-white/10 text-white/80 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-7 h-7" />
                 </div>
                 <h3 className="text-xl font-semibold mb-3 text-white/90">Liveness Anti-Spoof</h3>
                 <p className="text-sm text-white/50 leading-relaxed">
                   Sistem tak bisa dikelabui foto statis maupun topeng. Algoritma liveness secara aktif membedakan fisik asli dengan manipulasi.
                 </p>
              </div>
           </div>
        </section>

        {/* OVERVIEW SECTION */}
        <section className="py-20 mb-20 relative" id="akses">
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-16 backdrop-blur-xl relative overflow-hidden">
             <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-80 h-80 bg-green-500/30 blur-[100px] rounded-full pointer-events-none"></div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                <div>
                   <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Dirancang untuk<br/>Presisi & Keamanan</h2>
                   <p className="text-white/50 mb-10 leading-relaxed">Sistem cerdas kami tidak hanya mengenali wajah, tapi mengerti keamanan tingkat tinggi untuk data instansi Anda.</p>
                   
                   <div className="space-y-8">
                      <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                            <ScanFace className="w-5 h-5 text-green-400" />
                         </div>
                         <div>
                            <h4 className="font-semibold mb-1">Kualitas Otentikasi Tinggi</h4>
                            <p className="text-sm text-white/50">Mengenali dalam cahaya minim dan menyesuaikan perubahan visual wajah.</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                            <MapPin className="w-5 h-5 text-green-400" />
                         </div>
                         <div>
                            <h4 className="font-semibold mb-1">Sinkronisasi Real-Time</h4>
                            <p className="text-sm text-white/50">Data masuk detik itu juga ke dashboard admin dengan sistem berbasis cloud yang aman.</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="relative aspect-square md:aspect-video lg:aspect-square w-full bg-black/40 rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center group">
                   <div className="w-48 h-48 rounded-full border border-green-500/30 flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-full border border-green-500/10 scale-150 animate-ping" style={{animationDuration: '3s'}}></div>
                      <div className="absolute inset-0 rounded-full border border-green-500/20 scale-125 animate-ping" style={{animationDuration: '2s'}}></div>
                      <ScanFace className="w-16 h-16 text-green-400 group-hover:scale-110 transition-transform" />
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-20 border-t border-white/10" id="hubungi">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
             <a href="https://instagram.com/sentrakreasi.ukm" target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all group backdrop-blur-md">
               <Instagram className="w-8 h-8 mb-4 text-white/60 group-hover:text-green-400 transition-colors" />
               <h3 className="font-semibold mb-1 text-white/90">Instagram</h3>
               <p className="text-xs text-white/50">@sentrakreasi.ukm</p>
             </a>

             <a href="https://maps.google.com/?q=Sentrakreasi+Bandung+-7.0145892,107.595449" target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all group backdrop-blur-md">
               <MapPin className="w-8 h-8 mb-4 text-white/60 group-hover:text-green-400 transition-colors" />
               <h3 className="font-semibold mb-1 text-white/90">Lokasi Kami</h3>
               <p className="text-xs text-white/50">Buka Di Peta</p>
             </a>

             <a href="tel:+6289611284382" className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all group backdrop-blur-md">
               <Phone className="w-8 h-8 mb-4 text-white/60 group-hover:text-green-400 transition-colors" />
               <h3 className="font-semibold mb-1 text-white/90">Telepon</h3>
               <p className="text-xs text-white/50">0896-1128-4382</p>
             </a>

             <a href="mailto:sentrakreasibandung@gmail.com" className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all group backdrop-blur-md">
               <Mail className="w-8 h-8 mb-4 text-white/60 group-hover:text-green-400 transition-colors" />
               <h3 className="font-semibold mb-1 text-white/90">Email</h3>
               <p className="text-xs text-white/50">Bantuan Support</p>
             </a>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 pb-8 gap-6 text-sm text-white/40">
             <img src="/logo.png" alt="Sentra Kreasi Logo" className="h-8 object-contain brightness-200 opacity-70" />
             <p>&copy; {new Date().getFullYear()} SentraKreasi. All rights reserved.</p>
          </div>
        </footer>

        {/* Floating WhatsApp Action Button */}
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-4 group">
           <div className="bg-white/10 backdrop-blur-xl border border-white/10 text-white text-xs px-4 py-2 rounded-full opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-xl">
             Chat dengan Admin
           </div>
           <a href="https://wa.me/6289611284382" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-green-500 text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all hover:scale-110">
              <MessageCircle className="w-6 h-6" />
           </a>
        </div>

      </main>
    </div>
  );
}
