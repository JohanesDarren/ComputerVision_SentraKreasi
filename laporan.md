Listed directory src
Listed directory pages
Listed directory admin
Listed directory components
Listed directory layout
Viewed AppLayout.tsx:1-112
Viewed AdminLayout.tsx:1-112
Viewed Landing.tsx:1-216
Viewed Dashboard.tsx:1-261
Viewed AdminDashboard.tsx:1-299
Edited AdminLayout.tsx
Edited AppLayout.tsx
Edited Dashboard.tsx
Edited AdminDashboard.tsx
Edited Landing.tsx
Viewed History.tsx:1-186
Viewed AdminHistory.tsx:1-240
Edited History.tsx
Edited AdminHistory.tsx
Searched for "<video"
Searched for "Webcam"
Searched for "<Webcam"
Viewed Auth.tsx:1-265
Edited Auth.tsx
Viewed Presensi.tsx:1-271
Viewed Profile.tsx:1-276
Viewed QuickPresence.tsx:1-267
Edited Presensi.tsx
Edited QuickPresence.tsx
Edited Profile.tsx
Viewed AdminPegawai.tsx:1-129
Edited Profile.tsx
Edited AdminPegawai.tsx
Edited AdminHistory.tsx
Viewed AdminLayout.tsx:1-130
Viewed AppLayout.tsx:1-130
Edited AppLayout.tsx
Edited AdminLayout.tsx

Saya telah berhasil menyelesaikan semua poin perbaikan yang Anda minta berdasarkan hasil QA. Berikut adalah ringkasan perubahan dan penyelesaian yang sudah diterapkan:

**TASK 1: Perbaikan UI/UX & Layouting (Frontend)**
- **Dark/Light Mode Bug:** Memperbaiki warna background *blinding white* di layout User dan Admin dengan gradasi yang lebih soft (`to-[#e8f5e9]`). Hover bug pada tabel history (yang tadinya berubah jadi putih terang dan menutupi teks) kini sudah diatur agar menggunakan efek transparan gelap pada dark mode (`dark:hover:bg-slate-700/50`).
- **Pagination Log Presensi:** Mengganti tombol pagination sebelumnya/selanjutnya pada Riwayat Presensi (User) menjadi sebuah dropdown (opsi: 10, 20, 50 entri) yang sejajar dengan judul "Log Area Pindai". 
- **Search & Filter (User):** Mengaktifkan input bar Search (berdasarkan Status) dan input Date picker untuk mencari log kehadiran historis di menu *Riwayat Presensi*.

**TASK 2: Notifikasi & Validasi (Interactions)**
- **Form Validasi (Register):** Menambahkan *inline error messages* di bawah form pendaftaran jika ada kolom yang kosong. Validasi tambahan telah diterapkan: NIP *harus berupa angka*, Email *harus format valid*, dan Password *minimal 6 karakter*.
- **Alert/Snackbar (Profil):** Menambahkan notifikasi melayang di bawah layar ("Foto profil berhasil diubah/dihapus", "Informasi profil diperbarui") setelah user melakukan aksi di halaman Profil.
- **Navigasi Form Login:** Menempatkan tombol "Kembali" dengan icon panah di dalam *card* login untuk mempermudah navigasi ke *Landing Page*.
- **Kamera Picture in Picture:** Menerapkan props `disablePictureInPicture` di komponen `<Webcam />` yang ada di semua halaman yang memakai kamera (`Auth`, `Presensi`, `QuickPresence`, dan `Profile`) untuk menyembunyikan ikon 'picture in picture' browser bawaan.
- **Konsistensi Judul Presensi:** Mengubah judul Halaman `Presensi` dan `QuickPresence` menjadi **"Quick Presence"**.

**TASK 3: Logic & Backend API (Supabase & Antigravity)**
- **Tambah Pegawai (Admin):** Memperbaiki tombol "Tambah Pegawai" agar kini memunculkan *Pop-Up Modal* Form lengkap (Nama, NIP, Email, Password). Data akan disimpan langsung ke database Supabase saat disubmit.
- **Hapus Foto Profil:** Menambahkan tombol **"Hapus Foto Profil"** di halaman Profil untuk memudahkan user menghapus wajah/foto profil mereka secara lokal.
- **Export CSV:** Mengaktifkan tombol *Export CSV* di halaman Riwayat Admin yang secara otomatis men-download data (Nama, NIP, Waktu, Status) dari *Log Aktivitas* sesuai dengan parameter *search & filter* yang saat itu sedang aktif.

Semua perbaikan tersebut telah di-inject ke dalam *codebase* dan sudah siap untuk dites kembali! Silakan beri tahu jika masih ada yang terlewat atau jika Anda ingin mencoba mengujinya terlebih dahulu.