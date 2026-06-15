from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.core.config import supabase
from app.services.face_service import process_face_image
router = APIRouter()

# Ambang batas kemiripan (Cosine Similarity Threshold).
# Rentang nilai adalah 0 sampai 1.
# - 0.55 - 0.65 adalah rentang yang umum untuk Facenet512.
# - Semakin kecil nilainya, semakin longgar (mudah mengenali tapi risiko salah orang naik).
THRESHOLD_SIMILARITY = 0.55 

@router.post("/register-face")
async def register_face(
    pegawai_id: str = Form(..., description="UUID Pegawai dari tabel Supabase"),
    files: list[UploadFile] = File(..., description="File gambar wajah pegawai (bisa lebih dari satu)")
):
    """
    Endpoint untuk mendaftarkan wajah pegawai ke database.
    Menerima beberapa file gambar (berbagai sisi wajah), memproses semuanya, 
    merata-ratakan vektornya untuk akurasi tinggi, lalu simpan ke Supabase.
    """
    if not files or len(files) == 0:
        raise HTTPException(status_code=400, detail="Tidak ada gambar yang diunggah.")

    embeddings = []
    
    for file in files:
        try:
            contents = await file.read()
        except Exception:
            raise HTTPException(status_code=400, detail=f"Gagal membaca file gambar {file.filename}.")
        
        # Ekstrak embedding untuk masing-masing gambar (di background thread)
        from fastapi.concurrency import run_in_threadpool
        try:
            emb = await run_in_threadpool(process_face_image, contents)
            embeddings.append(emb)
        except Exception as e:
            # Jika salah satu gagal, kita bisa ignore atau throw error. 
            # Lebih aman throw error agar admin tahu foto tersebut jelek.
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=400, detail=f"Gagal memproses gambar {file.filename}: {str(e)}")
            
    if not embeddings:
        raise HTTPException(status_code=400, detail="Tidak ada wajah yang berhasil diekstrak.")
        
    # Rata-ratakan semua vektor (mean pooling)
    import numpy as np
    avg_embedding = np.mean(embeddings, axis=0)
    
    # L2 Normalization sangat penting agar representasi rata-rata (centroid) dari
    # 3 sudut wajah (depan, kiri, kanan) tetap berada di permukaan hypersphere
    # sehingga cosine similarity bisa bekerja dengan sangat optimal dan akurat.
    avg_embedding = avg_embedding / np.linalg.norm(avg_embedding)
    avg_embedding = avg_embedding.tolist()
    
    # 3. Simpan/Update vektor ke database Supabase
    try:
        response = supabase.table('pegawai').update({'embedding': avg_embedding}).eq('id', pegawai_id).execute()
        # Periksa apakah data berhasil diupdate
        if len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Pegawai tidak ditemukan di database.")
    except Exception as e:
        # Menangani jika UUID tidak valid atau masalah koneksi DB
        raise HTTPException(status_code=500, detail=f"Gagal menyimpan data ke database: {str(e)}")
        
    return {
        "status": "success",
        "message": "Wajah berhasil didaftarkan dan disimpan di database.",
        "data": {
            "pegawai_id": pegawai_id
        }
    }

@router.post("/verify-presence")
async def verify_presence(
    file: UploadFile = File(..., description="File gambar tangkapan kamera dari Node.js / Frontend")
):
    """
    Endpoint untuk melakukan presensi berdasarkan pengenalan wajah.
    """
    try:
        contents = await file.read()
    except Exception:
        raise HTTPException(status_code=400, detail="Gagal membaca file gambar presensi.")
    
    # 1 & 2. Deteksi wajah dengan YOLOv8 dan ekstrak embedding (Jalankan di background thread agar tidak blok server!)
    from fastapi.concurrency import run_in_threadpool
    try:
        embedding = await run_in_threadpool(process_face_image, contents)
    except Exception as e:
        # Jika process_face_image melempar HTTPException, kita harus raise ulang
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
    
    # 3. Pencarian wajah di database Supabase menggunakan RPC
    try:
        response = supabase.rpc(
            'match_face',
            {
                'query_embedding': embedding,
                'match_threshold': THRESHOLD_SIMILARITY,
                'match_count': 1  # Ambil 1 wajah yang memiliki similarity tertinggi
            }
        ).execute()
        
        matches = response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal melakukan pencarian di database: {str(e)}")
        
    # Jika tidak ada satupun yang melewati match_threshold
    if not matches or len(matches) == 0:
        # Debug: Cari tahu skor tertinggi yang ada di DB untuk membantu troubleshooting
        try:
            print(f"[Debug] Wajah tidak cocok dengan threshold {THRESHOLD_SIMILARITY}. Mencoba mencari kecocokan terdekat...")
            all_pegawai = supabase.table('pegawai').select('id, nama, embedding').not_.is_('embedding', 'null').execute()
            if all_pegawai.data:
                import numpy as np
                def cosine_similarity(v1, v2):
                    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))
                
                similarities = []
                for p in all_pegawai.data:
                    sim = cosine_similarity(embedding, p['embedding'])
                    similarities.append((p['nama'], sim))
                
                # Urutkan berdasarkan similarity tertinggi
                similarities.sort(key=lambda x: x[1], reverse=True)
                print(f"[Debug] Top 3 kecocokan terdekat:")
                for name, score in similarities[:3]:
                    print(f"  - {name}: {score:.4f}")
        except Exception as e:
            print(f"[Debug] Gagal melakukan debugging manual: {e}")
            
        raise HTTPException(status_code=401, detail="Wajah tidak dikenali. Pastikan Anda sudah terdaftar atau coba posisikan wajah lebih jelas.")
        
    pegawai_cocok = matches[0]
    
    # Catatan: Kita hanya mengembalikan data pegawai yang cocok ke Main Backend (Node.js).
    # Biarkan Node.js yang menyimpan log presensi dan mengatur statusnya (hadir/terlambat).
    
    return {
        "status": "success",
        "message": "Wajah dikenali. Verifikasi presensi berhasil.",
        "data": {
            "pegawai_id": pegawai_cocok['id'],
            "nama": pegawai_cocok['nama'],
            "nip": pegawai_cocok['nip'],
            "similarity_score": round(pegawai_cocok['similarity'], 4)
        }
    }

import json
import os
from pydantic import BaseModel

SETTINGS_FILE = os.path.join(os.path.dirname(__file__), "settings.json")

class AturanSettings(BaseModel):
    jam_masuk: str
    jam_keluar: str
    toleransi_menit: int
    jam_batas_pulang: str
    hari_libur: list = []

@router.get("/settings")
def get_settings():
    """
    Mengambil aturan presensi global dari file settings.json
    """
    if os.path.exists(SETTINGS_FILE):
        try:
            with open(SETTINGS_FILE, "r") as f:
                return json.load(f)
        except Exception:
            pass
            
    # Default settings jika belum ada
    return {
        "jam_masuk": "07:00",
        "jam_keluar": "17:00",
        "toleransi_menit": 15,
        "jam_batas_pulang": "23:59",
        "hari_libur": []
    }

@router.post("/settings")
def update_settings(settings: AturanSettings):
    """
    Menyimpan aturan presensi global ke file settings.json
    """
    try:
        with open(SETTINGS_FILE, "w") as f:
            json.dump(settings.dict(), f, indent=4)
        return {"status": "success", "message": "Aturan berhasil diperbarui."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menyimpan pengaturan: {str(e)}")
