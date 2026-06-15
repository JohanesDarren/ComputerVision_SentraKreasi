@echo off
cd /d "%~dp0"

echo ===================================================
echo Mempersiapkan Aplikasi Presensi AI SentraKreasi
echo ===================================================

echo.
echo [1/2] Memulai Frontend (React/Vite)...
start cmd /k "npm install && npm run dev"

echo.
echo [2/2] Memulai Backend Microservice (FastAPI)...
cd microservice
if not exist "venv" (
    echo Membuat Virtual Environment Python...
    python -m venv venv
)
start cmd /k ".\venv\Scripts\activate && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8001"

echo.
echo Selesai! Dua terminal baru telah terbuka untuk menjalankan Frontend dan Backend.
echo Silakan buka browser Anda di http://localhost:5173 (atau sesuai port Vite)
