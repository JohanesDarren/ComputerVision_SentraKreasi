import os
import re

directories = [
    'src/pages',
    'src/pages/admin',
    'src/components/layout'
]

def fix_colors(content):
    # Fix the logo shadow as requested: "berikan shadow disekitarnya agar dapat terlihat"
    # We will replace brightness-110 dark:brightness-200 with a strong dark shadow in light mode
    content = content.replace('brightness-110 dark:brightness-200', 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] dark:drop-shadow-sm brightness-110 dark:brightness-200')
    
    # We have lingering text-white that makes table contents invisible in light mode
    # Let's replace standalone text-white with text-slate-900 dark:text-white
    # Only if it's not already dark:text-white
    
    # We first replace all " text-white " or " text-white" with a placeholder to avoid messing up dark:text-white
    
    # Replace dark:text-white to safe marker
    content = content.replace('dark:text-white', 'DARK_TEXT_WHITE')
    
    # Now replace remaining text-white (which are the problematic ones)
    content = re.sub(r'(?<=\s)text-white(?=[\s"])', r'text-slate-900 DARK_TEXT_WHITE', content)
    
    # Restore the dark marker
    content = content.replace('DARK_TEXT_WHITE', 'dark:text-white')
    
    # Now, buttons with bg-green-500 shouldn't be text-slate-900
    # Let's fix buttons back to text-white
    content = re.sub(r'bg-green-([0-9]+) text-slate-900 dark:text-white', r'bg-green-\1 text-white dark:text-black', content)
    content = re.sub(r'bg-red-([0-9]+) text-slate-900 dark:text-white', r'bg-red-\1 text-white dark:text-black', content)
    
    # In AdminHistory, "Semua Data Presensi" is invisible because of a missing class
    # Let's make sure it's explicitly set.
    content = content.replace('<h3 className="text-lg font-semibold text-slate-900 dark:text-white">Semua Data Presensi</h3>', '<h3 className="text-lg font-bold text-slate-900 dark:text-white">Semua Data Presensi</h3>')
    
    return content

for dir_path in directories:
    if not os.path.exists(dir_path):
        continue
    for filename in os.listdir(dir_path):
        if not filename.endswith('.tsx'):
            continue
            
        filepath = os.path.join(dir_path, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        content = fix_colors(content)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed fonts/logo in {filepath}")

print("Done")
