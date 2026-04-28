import os

filepath = 'src/pages/admin/AdminHistory.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_logic = """      const [dateStr, pegawaiId] = key.split('_');
      const endOfDay = new Date(dateStr);
      endOfDay.setHours(23, 59, 59);"""

new_logic = """      const [dateStr, pegawaiId] = key.split('_');
      const endOfDay = new Date(dateStr);
      
      const aturanData = localStorage.getItem('app_aturan');
      let jamBatas = '23:59';
      if (aturanData) {
        const parsed = JSON.parse(aturanData);
        const active = parsed.find((a: any) => a.is_active);
        if (active && active.jam_batas_pulang) jamBatas = active.jam_batas_pulang;
      }
      const [bH, bM] = jamBatas.split(':').map(Number);
      endOfDay.setHours(bH, bM, 59);"""

content = content.replace(old_logic, new_logic)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
