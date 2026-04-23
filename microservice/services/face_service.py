import cv2
import numpy as np
from deepface import DeepFace
from fastapi import HTTPException
import os

# Model DeepFace yang menghasilkan embedding 512 dimensi.
EMBEDDING_MODEL = "Facenet512"

def process_face_image(image_bytes: bytes) -> list:
    """
    Mendeteksi wajah menggunakan YOLOv8 (melalui DeepFace) dan mengekstrak embedding.
    """
    # 1. Konversi bytes image ke format OpenCV (BGR)
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        raise HTTPException(status_code=400, detail="Format gambar tidak valid atau rusak.")

    try:
        # 2. Deteksi dengan YOLOv8 dan ekstraksi embedding
        # DeepFace akan otomatis mengunduh model YOLOv8-face jika belum ada.
        embedding_objs = DeepFace.represent(
            img_path=img, 
            model_name=EMBEDDING_MODEL,
            detector_backend="yolov8", # Menggunakan YOLOv8 khusus wajah!
            enforce_detection=True 
        )
        
        if not embedding_objs:
            raise HTTPException(status_code=400, detail="Wajah tidak terdeteksi di dalam gambar.")
            
        # 3. Jika ada beberapa wajah, ambil yang area-nya (width * height) paling besar (paling dekat dengan kamera)
        best_face = max(embedding_objs, key=lambda f: f['facial_area']['w'] * f['facial_area']['h'])
        
        return best_face["embedding"]
        
    except ValueError:
        # DeepFace melempar ValueError jika enforce_detection=True dan tidak ada wajah
        raise HTTPException(status_code=400, detail="Wajah tidak terdeteksi dengan jelas di dalam gambar.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat memproses wajah: {str(e)}")
