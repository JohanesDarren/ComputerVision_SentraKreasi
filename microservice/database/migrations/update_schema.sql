-- Tabel untuk menyimpan aturan jam presensi
CREATE TABLE IF NOT EXISTS aturan_presensi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_aturan VARCHAR(255) NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'aktif', -- 'aktif' atau 'nonaktif'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Masukkan data dummy awal jika tabel kosong
INSERT INTO aturan_presensi (nama_aturan, jam_mulai, jam_selesai, status)
SELECT 'Jam Masuk Pagi', '07:00:00', '08:30:00', 'aktif'
WHERE NOT EXISTS (SELECT 1 FROM aturan_presensi);

INSERT INTO aturan_presensi (nama_aturan, jam_mulai, jam_selesai, status)
SELECT 'Jam Pulang', '15:00:00', '17:00:00', 'aktif'
WHERE NOT EXISTS (SELECT 1 FROM aturan_presensi);
