import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Users, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function AdminPegawai() {
  const [pegawai, setPegawai] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPegawai = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pegawai')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPegawai(data || []);
    } catch (err) {
      console.error("Gagal memuat data pegawai:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPegawai();
  }, []);

  const handleDelete = async (id: string, nama: string) => {
    if (window.confirm(`Yakin ingin menghapus data biometrik dan akun ${nama}? Seluruh riwayat presensinya juga akan terhapus!`)) {
      try {
        await supabase.from('pegawai').delete().eq('id', id);
        fetchPegawai();
      } catch (err) {
        console.error("Gagal menghapus:", err);
        alert("Gagal menghapus pegawai.");
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-full space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-[#FAF8F5] dark:bg-[#2A2621] border-[4px] border-[#2C2825] dark:border-[#EFEBE1] rounded-none p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
             <h1 className="font-[Bebas_Neue] text-5xl tracking-wide text-[#2C2825] dark:text-[#EFEBE1] uppercase mb-2">Data Pegawai (Database)</h1>
             <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B5A4B] dark:text-[#A89886] border-t-[3px] border-[#2C2825] dark:border-[#EFEBE1] pt-4">
               Manajemen data pengguna aktif dan histori biometrik dari Supabase.
             </p>
          </div>
          <button onClick={fetchPegawai} className="p-3 bg-[#EFEBE1] border-[3px] border-[#2C2825] hover:bg-[#2C2825] hover:text-white transition-colors group">
            <RefreshCw className={`w-5 h-5 text-[#2C2825] group-hover:text-white ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto border-[3px] border-[#2C2825] dark:border-[#EFEBE1] bg-white dark:bg-[#151413]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EFEBE1] dark:bg-[#1E1C1A] border-b-[3px] border-[#2C2825] dark:border-[#EFEBE1]">
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Nama Lengkap</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">NIP</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Biometrik</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1]">Tanggal Daftar</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[#2C2825] dark:text-[#EFEBE1] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-sm font-bold uppercase tracking-widest animate-pulse">Memuat Data...</td></tr>
              ) : pegawai.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-sm font-bold uppercase tracking-widest">Tidak ada data pegawai.</td></tr>
              ) : pegawai.map((p) => (
                <tr key={p.id} className="border-b-[2px] border-[#2C2825] dark:border-[#2A2621] hover:bg-[#FAF8F5] dark:hover:bg-[#2A2621] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#386641] flex items-center justify-center border-[2px] border-[#2C2825]">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold text-[#2C2825] dark:text-[#EFEBE1] uppercase text-sm">{p.nama}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-[#6B5A4B] dark:text-[#A89886]">{p.nip}</td>
                  <td className="p-4">
                    {p.embedding ? (
                      <span className="bg-[#386641] text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider border-[2px] border-[#2C2825]">Terdaftar (512D)</span>
                    ) : (
                      <span className="bg-[#E36D4F] text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider border-[2px] border-[#2C2825]">Belum Terdaftar</span>
                    )}
                  </td>
                  <td className="p-4 text-xs font-bold text-[#6B5A4B] dark:text-[#A89886]">
                    {format(new Date(p.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(p.id, p.nama)} className="p-2 bg-[#E36D4F] text-white border-[2px] border-[#2C2825] hover:bg-[#2C2825] transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
