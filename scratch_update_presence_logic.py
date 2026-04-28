import os

presence_files = ['src/pages/Presensi.tsx', 'src/pages/QuickPresence.tsx']

for filepath in presence_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    old_logic = """    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const isLate = currentHour > 7 || (currentHour === 7 && currentMinute > 0);"""
    
    new_logic = """    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const aturanData = localStorage.getItem('app_aturan');
    let activeAturan = null;
    if (aturanData) {
      const parsed = JSON.parse(aturanData);
      activeAturan = parsed.find((a: any) => a.is_active);
    }
    
    const hariIniStr = new Date().getDay().toString();
    if (activeAturan && activeAturan.hari_libur && activeAturan.hari_libur.includes(hariIniStr)) {
      throw new Error('Hari ini adalah hari libur, presensi ditutup.');
    }

    let isLate = false;
    if (activeAturan && activeAturan.jam_masuk) {
      const [masukH, masukM] = activeAturan.jam_masuk.split(':').map(Number);
      const toleransi = activeAturan.toleransi_menit || 0;
      
      const batasMasukDate = new Date();
      batasMasukDate.setHours(masukH, masukM, 0, 0);
      batasMasukDate.setMinutes(batasMasukDate.getMinutes() + toleransi);
      
      if (new Date() > batasMasukDate) {
        isLate = true;
      }
    } else {
      const currentHour = new Date().getHours();
      const currentMinute = new Date().getMinutes();
      isLate = currentHour > 7 || (currentHour === 7 && currentMinute > 0);
    }"""
    
    content = content.replace(old_logic, new_logic)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
