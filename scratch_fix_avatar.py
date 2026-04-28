import os

# History.tsx replace
with open('src/pages/History.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
    
old_hist = """<div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-slate-100 dark:bg-slate-700 shadow-sm text-slate-700 dark:text-white/80 border border-slate-300 dark:border-slate-700 group-hover:bg-green-500 group-hover:text-white dark:text-black transition-colors">
                       {item.pegawai?.nama?.substring(0, 2).toUpperCase() || '??'}
                    </div>"""
new_hist = """<div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-slate-100 dark:bg-slate-700 shadow-sm text-slate-700 dark:text-white/80 border border-slate-300 dark:border-slate-700 group-hover:bg-green-500 group-hover:text-white dark:text-black transition-colors overflow-hidden shrink-0">
                       {item.gambar_bukti_url ? (
                         <img src={item.gambar_bukti_url} alt="Bukti" className="w-full h-full object-cover" />
                       ) : (
                         item.pegawai?.nama?.substring(0, 2).toUpperCase() || '??'
                       )}
                    </div>"""
content = content.replace(old_hist, new_hist)
content = content.replace("`id, waktu_hadir, status, pegawai:pegawai_id (nama, nip)`", "`id, waktu_hadir, status, gambar_bukti_url, pegawai:pegawai_id (nama, nip)`")
with open('src/pages/History.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# AdminHistory.tsx replace
with open('src/pages/admin/AdminHistory.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
old_ahist = """<div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-slate-100 dark:bg-slate-700 shadow-sm text-slate-700 dark:text-white/80 border border-slate-300 dark:border-slate-700 group-hover:bg-green-500 group-hover:text-white dark:text-black transition-colors">
                        {item.pegawai?.nama?.substring(0, 2).toUpperCase() || '??'}
                    </div>"""
new_ahist = """<div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-slate-100 dark:bg-slate-700 shadow-sm text-slate-700 dark:text-white/80 border border-slate-300 dark:border-slate-700 group-hover:bg-green-500 group-hover:text-white dark:text-black transition-colors overflow-hidden shrink-0">
                        {item.gambar_bukti_url ? (
                          <img src={item.gambar_bukti_url} alt="Bukti" className="w-full h-full object-cover" />
                        ) : (
                          item.pegawai?.nama?.substring(0, 2).toUpperCase() || '??'
                        )}
                    </div>"""
content = content.replace(old_ahist, new_ahist)
content = content.replace("waktu_hadir,\n          status,", "waktu_hadir,\n          status,\n          gambar_bukti_url,")
with open('src/pages/admin/AdminHistory.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# AdminDashboard.tsx replace
with open('src/pages/admin/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
old_adash = """<div className="w-10 h-10 rounded-full bg-green-400/20 dark:bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center font-bold text-sm">
                      {item.pegawai?.nama?.substring(0,2).toUpperCase() || '?'}
                   </div>"""
new_adash = """<div className="w-10 h-10 rounded-full bg-green-400/20 dark:bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center font-bold text-sm overflow-hidden shrink-0">
                      {item.gambar_bukti_url ? (
                        <img src={item.gambar_bukti_url} alt="Bukti" className="w-full h-full object-cover" />
                      ) : (
                        item.pegawai?.nama?.substring(0,2).toUpperCase() || '?'
                      )}
                   </div>"""
content = content.replace(old_adash, new_adash)
content = content.replace("select('id, waktu_hadir, status, pegawai:pegawai_id (nama, nip)')", "select('id, waktu_hadir, status, gambar_bukti_url, pegawai:pegawai_id (nama, nip)')")
with open('src/pages/admin/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# Presensi.tsx and QuickPresence.tsx
with open('src/pages/Presensi.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("gambar_bukti_url: null", "gambar_bukti_url: imageSrc")
with open('src/pages/Presensi.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/pages/QuickPresence.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("gambar_bukti_url: null", "gambar_bukti_url: imageSrc")
with open('src/pages/QuickPresence.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
