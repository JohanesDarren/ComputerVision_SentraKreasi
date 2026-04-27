import os
import re

directories = [
    'src/pages',
    'src/pages/admin',
    'src/components/layout'
]

replacements = [
    # Background layout gradient
    (r'bg-gradient-to-br from-\[\#021208\] via-\[\#0a2e15\] to-\[\#000000\] text-white', 
     r'bg-gradient-to-br from-[#e8f5e9] via-[#f1f8f5] to-[#ffffff] dark:from-[#021208] dark:via-[#0a2e15] dark:to-[#000000] text-slate-900 dark:text-white'),
    (r'bg-gradient-to-br from-\[\#021208\] via-\[\#0a2e15\] to-\[\#000000\] text-white', 
     r'bg-gradient-to-br from-[#e8f5e9] via-[#f1f8f5] to-[#ffffff] dark:from-[#021208] dark:via-[#0a2e15] dark:to-[#000000] text-slate-900 dark:text-white'),
    
    # Text colors
    (r'text-white(\s)', r'text-slate-900 dark:text-white\1'),
    (r'text-white/([0-9]+)', r'text-slate-900/\1 dark:text-white/\1'),
    (r'text-black(\s)', r'text-white dark:text-black\1'),
    
    # Background glassmorphism
    (r'bg-white/5(\s)', r'bg-white/60 dark:bg-white/5\1'),
    (r'bg-white/10(\s)', r'bg-white/80 dark:bg-white/10\1'),
    (r'bg-black/40(\s)', r'bg-white/50 dark:bg-black/40\1'),
    (r'bg-black/60(\s)', r'bg-white/70 dark:bg-black/60\1'),
    
    # Border
    (r'border-white/5(\s)', r'border-slate-900/5 dark:border-white/5\1'),
    (r'border-white/10(\s)', r'border-slate-900/10 dark:border-white/10\1'),
    
    # Gradients specifically missed
    (r'bg-\[\#030712\]/80', r'bg-white/80 dark:bg-[#061b0d]/80'),
    (r'bg-\[\#061b0d\]/80', r'bg-white/80 dark:bg-[#061b0d]/80'),

    # Background glow adjustments
    (r'bg-green-500/10', r'bg-green-400/20 dark:bg-green-500/10'),
    (r'bg-green-500/20', r'bg-green-400/30 dark:bg-green-500/20'),
    (r'bg-green-600/10', r'bg-green-500/20 dark:bg-green-600/10'),
    (r'bg-green-900/20', r'bg-green-400/10 dark:bg-green-900/20'),
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
            
        # Clean up double darks or mixed artifacts if any
        content = content.replace('dark:dark:', 'dark:')
        content = content.replace('text-slate-900/ dark:text-white/', 'text-slate-900/50 dark:text-white/50') # Just in case

        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filepath}")

print("Done")
