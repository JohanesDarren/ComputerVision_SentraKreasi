from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from core.config import supabase
from services.face_service import process_face_image
router = APIRouter()

# Ambang batas kemiripan (Cosine Similarity Threshold).
# Rentang nilai adalah 0 sampai 1.
# - > 0.6 atau 0.7 sering dianggap "wajah yang sama" untuk Facenet512.
# - Sesuaikan nilai ini saat testing di lingkungan PAUD sesungguhnya 
#   (tergantung pencahayaan dan kualitas kamera).
THRESHOLD_SIMILARITY = 0.65 

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
    avg_embedding = np.mean(embeddings, axis=0).tolist()
    
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
