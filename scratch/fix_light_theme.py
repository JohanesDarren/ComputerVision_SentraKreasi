import os
import re

directories = [
    'src/pages',
    'src/pages/admin',
    'src/components/layout'
]

replacements = [
    # Headings and gradient text
    (r'from-white to-white/60', r'from-slate-900 to-slate-600 dark:from-white dark:to-white/60'),
    (r'from-white to-white/60', r'from-slate-900 to-slate-600 dark:from-white dark:to-white/60'), # To be safe
    
    # Fix black bg
    (r'bg-black(\s)', r'bg-white dark:bg-black\1'),
    (r'bg-black/20(\s)', r'bg-slate-200/50 dark:bg-black/20\1'),
    (r'bg-black/30(\s)', r'bg-white/60 dark:bg-black/30\1'),
    (r'bg-black/50(\s)', r'bg-white/80 dark:bg-black/50\1'),
    
    # Text replacements that might be missing
    (r'text-white/80', r'text-slate-700 dark:text-white/80'),
    (r'text-white/70', r'text-slate-600 dark:text-white/70'),
    (r'text-white/60', r'text-slate-500 dark:text-white/60'),
    (r'text-white/50', r'text-slate-500 dark:text-white/50'),
    (r'text-white/40', r'text-slate-400 dark:text-white/40'),
    (r'text-white/30', r'text-slate-400 dark:text-white/30'),
    (r'text-white/20', r'text-slate-300 dark:text-white/20'),

    # Cards that got milky. Let's make sure they are somewhat translucent white on light mode
    (r'bg-white/60 dark:bg-white/5', r'bg-white/70 dark:bg-white/5 shadow-sm dark:shadow-none'),
    (r'bg-white/80 dark:bg-white/10', r'bg-white/90 dark:bg-white/10 shadow-sm dark:shadow-none'),
    
    # Placeholder fixes
    (r'placeholder-white/30', r'placeholder-slate-400 dark:placeholder-white/30'),
    (r'placeholder-white/40', r'placeholder-slate-400 dark:placeholder-white/40'),
]

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
        
        # Apply replacements
        for pattern, replacement in replacements:
            content = re.sub(pattern, replacement, content)
            
        # Clean up some common issues that happen from double replacing
        content = content.replace('text-slate-900/50', 'text-slate-500')
        content = content.replace('text-slate-900/60', 'text-slate-500')
        content = content.replace('text-slate-900/40', 'text-slate-400')
        content = content.replace('text-slate-900/70', 'text-slate-600')
        content = content.replace('text-slate-900/80', 'text-slate-700')
        content = content.replace('dark:dark:', 'dark:')
        content = content.replace('shadow-sm dark:shadow-none shadow-sm dark:shadow-none', 'shadow-sm dark:shadow-none')

        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filepath}")

print("Done")
