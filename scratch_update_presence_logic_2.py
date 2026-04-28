import os

# AdminHistory.tsx update
filepath = 'src/pages/admin/AdminHistory.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_logic = """      const aturanData = localStorage.getItem('app_aturan');
      let jamBatas = '23:59';
      if (aturanData) {
        const parsed = JSON.parse(aturanData);
        const active = parsed.find((a: any) => a.is_active);
        if (active && active.jam_batas_pulang) jamBatas = active.jam_batas_pulang;
      }"""
new_logic = """      const aturanData = localStorage.getItem('app_aturan_standar');
      let jamBatas = '23:59';
      if (aturanData) {
        const parsed = JSON.parse(aturanData);
        if (parsed.jam_batas_pulang) jamBatas = parsed.jam_batas_pulang;
      }"""
content = content.replace(old_logic, new_logic)
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

# Presensi and QuickPresence update
for filepath in ['src/pages/Presensi.tsx', 'src/pages/QuickPresence.tsx']:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    old_logic = """    const aturanData = localStorage.getItem('app_aturan');
    let activeAturan = null;
    if (aturanData) {
      const parsed = JSON.parse(aturanData);
      activeAturan = parsed.find((a: any) => a.is_active);
    }
    
    const hariIniStr = new Date().getDay().toString();
    if (activeAturan && activeAturan.hari_libur && activeAturan.hari_libur.includes(hariIniStr)) {
      throw new Error('Hari ini adalah hari libur, presensi ditutup.');
    }"""
    
    new_logic = """    const aturanData = localStorage.getItem('app_aturan_standar');
    let activeAturan = null;
    if (aturanData) {
      activeAturan = JSON.parse(aturanData);
    }
    
    // Format YYYY-MM-DD local logic safely
    const todayObj = new Date();
    const tzOffset = todayObj.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(todayObj.getTime() - tzOffset)).toISOString().split('T')[0];
    
    if (activeAturan && activeAturan.hari_libur && activeAturan.hari_libur.includes(localISOTime)) {
      throw new Error('Hari ini adalah hari Libur Nasional, sistem presensi ditutup.');
    }"""
    
    content = content.replace(old_logic, new_logic)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
