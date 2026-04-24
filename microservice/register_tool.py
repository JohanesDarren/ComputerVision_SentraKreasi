import os
from dotenv import load_dotenv
from core.config import supabase
import sys
import requests

load_dotenv()

def register_new_pegawai(nama, nip, image_path):
    # 1. Baca dan validasi file gambar
    if not os.path.exists(image_path):
        print(f"❌ File/Lokasi {image_path} tidak ditemukan!")
        return
        
    if os.path.isdir(image_path):
        print(f"❌ '{image_path}' adalah sebuah FOLDER/DIREKTORI. Anda harus memasukkan path ke FILE GAMBAR secara spesifik (misal: C:\\Users\\User\\Pictures\\foto_saya.jpg)")
        return
        
    print(f"1. Mengecek/mendaftarkan pegawai: {nama} ({nip})...")
    
    pegawai_id = None
    # Cek apakah NIP sudah ada
    check_response = supabase.table('pegawai').select('id').eq('nip', nip).execute()
    
    if len(check_response.data) > 0:
        pegawai_id = check_response.data[0]['id']
        print(f"   NIP sudah terdaftar! Menggunakan ID Pegawai yang sudah ada: {pegawai_id}")
    else:
        try:
            response = supabase.table('pegawai').insert({'nama': nama, 'nip': nip}).execute()
            if not response.data:
                print("❌ Gagal menyimpan data pegawai ke database.")
                return
            pegawai_id = response.data[0]['id']
            print(f"   Pegawai Baru Berhasil Dibuat! ID Pegawai: {pegawai_id}")
        except Exception as e:
            print(f"❌ Error saat insert ke Supabase: {e}")
            return
        
    print(f"2. Mengekstrak dan mendaftarkan wajah dari {image_path} ke AI...")
    
    # 3. Kirim ke API FastAPI untuk diekstrak wajahnya
    url = "http://localhost:8000/api/v1/register-face"
    try:
        with open(image_path, 'rb') as f:
            files = {'file': (os.path.basename(image_path), f, 'image/jpeg')}
            data = {'pegawai_id': pegawai_id}
            
            # Ini mungkin butuh waktu lama jika model AI (YOLO/Facenet) sedang didownload pertama kali!
            print("   Sedang memproses wajah... (Ini mungkin memakan waktu beberapa menit saat pertama kali)")
            res = requests.post(url, data=data, files=files)
            
            if res.status_code == 200:
                print("✅ SUKSES! Wajah Anda berhasil didaftarkan ke Database!")
            else:
                print(f"❌ Gagal mendaftarkan wajah: {res.text}")
    except Exception as e:
        print(f"Terjadi kesalahan saat memanggil API: {e}")

if __name__ == "__main__":
    print("=== TOOL PENDAFTARAN WAJAH ===")
    nama = input("Masukkan Nama Lengkap: ")
    nip = input("Masukkan NIP/Nomor Identitas: ")
    img_path = input("Masukkan path/lokasi file foto wajah Anda (contoh: C:\\foto_saya.jpg): ")
    
    register_new_pegawai(nama, nip, img_path.strip('"\''))
