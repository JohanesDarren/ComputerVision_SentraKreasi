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
    file: UploadFile = File(..., description="File gambar wajah pegawai")
):
    """
    Endpoint untuk mendaftarkan wajah pegawai ke database.
    Menerima file gambar dan ID pegawai, memproses wajahnya, dan mengupdate vektor di Supabase.
    """
    try:
        contents = await file.read()
    except Exception:
        raise HTTPException(status_code=400, detail="Gagal membaca file gambar yang diunggah.")
    
    # 1 & 2. Deteksi wajah dengan YOLOv8 dan ekstrak embedding dengan DeepFace
    embedding = process_face_image(contents)
    
    # 3. Simpan/Update vektor ke database Supabase
    try:
        response = supabase.table('pegawai').update({'embedding': embedding}).eq('id', pegawai_id).execute()
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
    
    # 1 & 2. Deteksi wajah dengan YOLOv8 dan ekstrak embedding
    embedding = process_face_image(contents)
    
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
