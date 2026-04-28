import os
import glob

# Paths to process
paths = glob.glob('src/**/*.tsx', recursive=True)

replacements = [
    ('bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none border border-slate-900/10 dark:border-white/10', 'bg-slate-50 dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700'),
    ('bg-white/95 dark:bg-black/40 shadow-xl border border-slate-900/10 dark:border-white/10', 'bg-slate-50 dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700'),
    ('bg-white/95 dark:bg-black/40 shadow-xl border border-slate-900/5 dark:border-white/5', 'bg-slate-50 dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700'),
    ('bg-white/95 dark:bg-white/5 shadow-xl dark:shadow-none', 'bg-slate-50 dark:bg-slate-800 shadow-sm dark:shadow-none'),
    ('bg-white/95 dark:bg-white/5', 'bg-slate-50 dark:bg-slate-800'),
    ('bg-white/90 dark:bg-white/10 shadow-xl dark:shadow-none', 'bg-slate-100 dark:bg-slate-700 shadow-sm dark:shadow-none'),
    ('bg-white/90 dark:bg-white/10', 'bg-slate-100 dark:bg-slate-700'),
    ('bg-white/70 dark:bg-black/60 border border-slate-900/5 dark:border-white/5', 'bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600'),
    ('backdrop-blur-xl', ''),
    ('backdrop-blur-md', ''),
    ('backdrop-blur-sm', ''),
    ('backdrop-blur-2xl', ''),
    ('shadow-xl dark:shadow-none', 'shadow-sm dark:shadow-none'),
    ('border-slate-900/10 dark:border-white/10', 'border-slate-200 dark:border-slate-700')
]

for file in paths:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements:
        new_content = new_content.replace(old, new)
    
    # replace duplicate spaces resulting from removing backdrop-blur
    new_content = new_content.replace('  ', ' ')
        
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")
