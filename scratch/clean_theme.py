import os
import re

directories = [
    'src/pages',
    'src/pages/admin',
    'src/components/layout'
]

def clean_classes(content):
    # Fix the messy duplicate text classes
    content = re.sub(r'text-slate-[0-9]+ dark:text-slate-[0-9]+ dark:text-white/([0-9]+)', r'text-slate-600 dark:text-white/\1', content)
    content = re.sub(r'text-slate-[0-9]+/([0-9]+) dark:text-white/([0-9]+)', r'text-slate-600 dark:text-white/\2', content)
    content = re.sub(r'text-slate-900 dark:text-slate-900 dark:text-white', r'text-slate-900 dark:text-white', content)
    
    # Text-white replacing issues
    content = re.sub(r'text-white dark:text-black', r'text-white dark:text-black', content) # This is okay for buttons
    
    # Fix shadow duplicates
    content = re.sub(r'(shadow-sm dark:shadow-none\s+)+', r'shadow-sm dark:shadow-none ', content)
    
    # Fix border duplicates
    content = re.sub(r'border-slate-900/10 dark:border-white/10\s+border-slate-900/10 dark:border-white/10', r'border-slate-900/10 dark:border-white/10', content)
    
    # Fix backgrounds
    content = re.sub(r'bg-white/70 dark:bg-white/5 shadow-sm dark:shadow-none', r'bg-white/80 dark:bg-white/5 shadow-lg dark:shadow-none', content)
    content = re.sub(r'bg-white/90 dark:bg-white/10 shadow-sm dark:shadow-none', r'bg-white/90 dark:bg-white/10 shadow-lg dark:shadow-none', content)
    
    # Ensure text visibility on cards
    content = re.sub(r'text-slate-[0-9]+ dark:text-slate-[0-9]+ dark:text-white', r'text-slate-900 dark:text-white', content)
    content = re.sub(r'text-slate-500 dark:text-white/50', r'text-slate-600 dark:text-white/50', content)
    content = re.sub(r'text-slate-400 dark:text-white/40', r'text-slate-500 dark:text-white/40', content)
    
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
        content = clean_classes(content)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Cleaned {filepath}")

print("Done")
