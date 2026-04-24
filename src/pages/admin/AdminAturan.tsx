import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Settings, RefreshCw, Plus } from 'lucide-react';

export default function AdminAturan() {
  const [aturan, setAturan] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAturan = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('aturan_presensi')
        .select('*')
        .order('jam_mulai', { ascending: true });
      
      // Jika error, berarti tabel belum dibuat, atau ada error lain
      if (error) {
        console.warn("Mungkin tabel aturan_presensi belum ada:", error);
      } else {
        setAturan(data || []);
      }
    } catch (err) {
      console.error("Gagal memuat aturan:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAturan();
  }, []);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'aktif' ? 'nonaktif' : 'aktif';
    try {
      await supabase.from('aturan_presensi').update({ status: newStatus }).eq('id', id);
      fetchAturan();
    } catch (err) {
      console.error("Gagal mengubah status:", err);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-full space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] rounded-none p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
             <h1 className="font-[Bebas_Neue] text-5xl tracking-wide text-[#2C2825] dark:text-[#EFEBE1] uppercase mb-2">Aturan Presensi (Database)</h1>
             <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B5A4B] dark:text-[#A89886] border-t-[3px] border-[#2C2825] dark:border-[#EFEBE1] pt-4">
               Konfigurasi parameter waktu kehadiran sekolah dari Supabase.
             </p>
          </div>
          <button onClick={fetchAturan} className="p-3 bg-[#EFEBE1] border-[3px] border-[#2C2825] hover:bg-[#2C2825] hover:text-white transition-colors group">
            <RefreshCw className={`w-5 h-5 text-[#2C2825] group-hover:text-white ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {aturan.length === 0 && !isLoading && (
          <div className="bg-[#E36D4F]/10 border-[3px] border-[#E36D4F] p-4 mb-6">
             <p className="text-sm font-bold text-[#E36D4F] uppercase tracking-widest mb-2">PERINGATAN: TABEL BELUM ADA / KOSONG</p>
             <p className="text-xs font-bold text-[#6B5A4B]">Tabel "aturan_presensi" sepertinya belum dibuat atau kosong di Supabase. Harap jalankan script SQL yang diberikan untuk membuatnya.</p>
          </div>
        )}

        <div className="overflow-x-auto border-[3px] border-[#2C2825] dark:border-[#EFEBE1] bg-white dark:bg-[#151413] mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EFEBE1] dark:bg-[#1E1C1A] border-b-[3px] border-[#2C2825] dark:border-[#EFEBE1]">
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Nama Aturan</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Jam Mulai</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Jam Selesai</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Status</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-sm font-bold uppercase tracking-widest animate-pulse">Memuat Data...</td></tr>
              ) : aturan.map((a) => (
                <tr key={a.id} className="border-b-[2px] border-[#2C2825] dark:border-[#2A2621] hover:bg-[#FAF8F5] dark:hover:bg-[#2A2621] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#2C2825] flex items-center justify-center border-[2px] border-[#EFEBE1]">
                        <Settings className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold text-[#2C2825] dark:text-[#EFEBE1] uppercase text-sm">{a.nama_aturan}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-[#6B5A4B] dark:text-[#A89886]">{a.jam_mulai}</td>
                  <td className="p-4 text-sm font-bold text-[#6B5A4B] dark:text-[#A89886]">{a.jam_selesai}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border-[2px] border-[#2C2825] ${a.status === 'aktif' ? 'bg-[#386641] text-white' : 'bg-[#EFEBE1] text-[#2C2825]'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => toggleStatus(a.id, a.status)} className="p-2 bg-[#FAF8F5] dark:bg-[#1E1C1A] text-[#2C2825] dark:text-white border-[2px] border-[#2C2825] dark:border-[#EFEBE1] hover:bg-[#2C2825] hover:text-white transition-colors text-[10px] font-bold uppercase">
                      Ubah Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <button className="flex items-center gap-2 bg-[#386641] text-white px-6 py-3 border-[3px] border-[#2C2825] font-bold uppercase tracking-widest text-xs hover:bg-[#2C2825] transition-colors">
          <Plus className="w-4 h-4" /> Tambah Aturan Baru
        </button>
      </div>
    </div>
  );
}
