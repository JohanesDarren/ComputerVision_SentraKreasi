import os
import re

directories = [
    'src/pages',
    'src/pages/admin',
    'src/components/layout'
]

def clean_file(content):
    # Eliminate all messy text classes
    # e.g., "text-slate-600 dark:text-slate-600 dark:text-white/70" -> "text-slate-600 dark:text-white/70"
    content = re.sub(r'text-slate-([0-9]+) dark:text-slate-\1 dark:text-white', r'text-slate-\1 dark:text-white', content)
    content = re.sub(r'text-slate-([0-9]+) dark:text-slate-\1 dark:text-white/([0-9]+)', r'text-slate-\1 dark:text-white/\2', content)
    
    # Same but with slate-500
    content = re.sub(r'text-slate-500 dark:text-slate-500 dark:text-white/([0-9]+)', r'text-slate-700 dark:text-white/\1', content)
    content = re.sub(r'text-slate-600 dark:text-white/([0-9]+)', r'text-slate-700 dark:text-white/\1', content)
    
    # Increase visibility of all text on light mode
    content = content.replace('text-slate-600', 'text-slate-800')
    content = content.replace('text-slate-500', 'text-slate-700')
    content = content.replace('text-slate-400', 'text-slate-600')
    
    # Make glassmorphism cards less transparent on light mode to improve contrast
    content = content.replace('bg-white/80 dark:bg-white/5', 'bg-white/95 dark:bg-white/5 shadow-xl')
    content = content.replace('bg-white/70 dark:bg-white/5', 'bg-white/95 dark:bg-white/5 shadow-xl')
    content = content.replace('bg-white/50 dark:bg-black/40', 'bg-white/95 dark:bg-black/40 shadow-xl')
    
    # Fix the duplicate shadow issue
    content = re.sub(r'(shadow-[a-z]+ )+dark:shadow-none', r'shadow-xl dark:shadow-none', content)
    content = content.replace('shadow-xl dark:shadow-none shadow-xl', 'shadow-xl dark:shadow-none')
    
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
        content = clean_file(content)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Deep cleaned {filepath}")

print("Done")
