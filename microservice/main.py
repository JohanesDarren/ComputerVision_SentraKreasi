from fastapi import FastAPI
from api.routes import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Face Recognition Microservice",
    description="Microservice Python untuk deteksi dan pengenalan wajah pada sistem presensi PAUD.",
    version="1.0.0"
)

# Setup CORS agar bisa diakses oleh Main Backend (Node.js) atau Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Ganti "*" dengan domain spesifik Node.js di environment production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Daftarkan rute API
app.include_router(router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {
        "status": "success",
        "message": "API Face Recognition Microservice Aktif!"
    }
