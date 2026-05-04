-- Tambahkan kolom password ke tabel pegawai
ALTER TABLE pegawai ADD COLUMN IF NOT EXISTS password TEXT;

-- Pastikan email juga ada (sudah ada di update_auth_schema.sql tapi untuk jaga-jaga)
ALTER TABLE pegawai ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
