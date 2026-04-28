import glob

paths = glob.glob('src/**/*.tsx', recursive=True)

replacements = [
    ('bg-slate-400 dark:bg-slate-800', 'bg-slate-400 dark:bg-slate-800'),
    ('bg-slate-400 dark:bg-slate-700', 'bg-slate-400 dark:bg-slate-700'),
    ('border-slate-200 dark:border-slate-700', 'border-slate-300 dark:border-slate-700')
]

for file in paths:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements:
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")
