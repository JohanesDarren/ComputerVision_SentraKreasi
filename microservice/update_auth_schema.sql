-- Hapus semua data dummy sebelumnya
TRUNCATE TABLE presensi CASCADE;
TRUNCATE TABLE pegawai CASCADE;

-- Tambahkan kolom email ke tabel pegawai untuk dihubungkan dengan autentikasi
ALTER TABLE pegawai ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
