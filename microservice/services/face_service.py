import cv2
import numpy as np
from deepface import DeepFace
from fastapi import HTTPException
import os
import logging

logger = logging.getLogger(__name__)

# Model yang digunakan
EMBEDDING_MODEL = "Facenet512"

# --- Pre-load model sekali saat startup ---
# Ini mencegah model dimuat ulang di setiap request (penyebab utama lambat)
_model_loaded = False

def _ensure_model_loaded():
    global _model_loaded
    if not _model_loaded:
        logger.info("Pre-loading Facenet512 model ke memori...")
        try:
            # Dummy call untuk memuat model ke cache memori
            dummy = np.zeros((160, 160, 3), dtype=np.uint8)
            DeepFace.represent(
                img_path=dummy,
                model_name=EMBEDDING_MODEL,
                detector_backend="skip",  # skip detection untuk warm-up
                enforce_detection=False,
            )
            _model_loaded = True
            logger.info("Model Facenet512 berhasil dimuat ke memori.")
        except Exception as e:
            logger.warning(f"Warm-up model gagal (tidak kritis): {e}")
            _model_loaded = True  # Tetap set True agar tidak loop

def process_face_image(image_bytes: bytes) -> list:
    """
    Mendeteksi wajah dan mengekstrak embedding menggunakan Facenet512.
    Menggunakan opencv (detector cepat) dengan fallback ke mtcnn.
    """
    # Pastikan model sudah di-load
    _ensure_model_loaded()

    # 1. Konversi bytes ke format OpenCV (BGR)
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise HTTPException(status_code=400, detail="Format gambar tidak valid atau rusak.")

    embedding_objs = None

    # 2. Coba detector opencv (ringan & cepat, ~100ms)
    try:
        embedding_objs = DeepFace.represent(
            img_path=img,
            model_name=EMBEDDING_MODEL,
            detector_backend="opencv",
            enforce_detection=True,
            align=True
        )
    except ValueError:
        pass

    # 3. Fallback ke mtcnn jika opencv gagal (~300ms, lebih akurat untuk sudut wajah)
    if not embedding_objs:
        try:
            logger.info("opencv gagal, mencoba fallback ke mtcnn...")
            embedding_objs = DeepFace.represent(
                img_path=img,
                model_name=EMBEDDING_MODEL,
                detector_backend="mtcnn",
                enforce_detection=True,
                align=True
            )
        except ValueError:
            pass

    if not embedding_objs:
        raise HTTPException(
            status_code=400,
            detail="Wajah tidak terdeteksi. Pastikan pencahayaan cukup dan wajah terlihat jelas di kamera."
        )

    # 4. Ambil wajah dengan area terbesar (paling dekat kamera)
    best_face = max(embedding_objs, key=lambda f: f['facial_area']['w'] * f['facial_area']['h'])
    return best_face["embedding"]
