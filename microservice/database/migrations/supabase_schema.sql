-- Aktifkan ekstensi vector
CREATE EXTENSION IF NOT EXISTS vector;

-- Buat tabel pegawai
CREATE TABLE IF NOT EXISTS pegawai (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama VARCHAR(255) NOT NULL,
    nip VARCHAR(50) UNIQUE NOT NULL,
    embedding vector(512), -- Menggunakan model Facenet512 (menghasilkan 512 dimensi)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buat tabel presensi
CREATE TABLE IF NOT EXISTS presensi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pegawai_id UUID REFERENCES pegawai(id) ON DELETE CASCADE,
    waktu_hadir TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'hadir', -- Contoh: hadir, terlambat
    gambar_bukti_url TEXT
);

-- Buat function SQL untuk pencarian Cosine Similarity
-- Cosine distance di pgvector menggunakan operator <=>
-- Cosine similarity = 1 - cosine distance
CREATE OR REPLACE FUNCTION match_face(
    query_embedding vector(512),
    match_threshold float,
    match_count int
)
RETURNS TABLE (
    id UUID,
    nama VARCHAR(255),
    nip VARCHAR(50),
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.nama,
        p.nip,
        1 - (p.embedding <=> query_embedding) AS similarity
    FROM pegawai p
    WHERE p.embedding IS NOT NULL
      AND 1 - (p.embedding <=> query_embedding) > match_threshold
    ORDER BY p.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
