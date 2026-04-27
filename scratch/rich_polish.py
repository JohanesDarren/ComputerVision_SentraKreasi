import os
import re

directories = [
    'src/pages',
    'src/pages/admin',
    'src/components/layout'
]

def rich_polish(content):
    # 1. Fix Hover states on cards that break Light Mode contrast
    # Previously: hover:bg-white/[0.08] which forces 8% opacity in light mode!
    content = content.replace('hover:bg-white/[0.08]', 'hover:bg-white dark:hover:bg-white/10')
    content = content.replace('hover:bg-white/10 ', 'hover:bg-white dark:hover:bg-white/10 ')
    content = content.replace('hover:bg-white/20 ', 'hover:bg-white dark:hover:bg-white/20 ')
    
    # 2. Add rich color variants to the background glow
    # If a page only has green glow, let's inject a cyan/blue glow to make it richer
    # Find the div containing the glow elements:
    glow_pattern = r'(<div className="absolute [^>]+bg-green-[^>]+></div>\s*)(<div className="absolute [^>]+bg-green-[^>]+></div>)'
    
    # We will replace the second green orb with a cyan orb
    def repl_glow(match):
        orb1 = match.group(1)
        orb2 = match.group(2)
        # Turn the second green orb into cyan
        orb2 = re.sub(r'bg-green-[0-9]+/[0-9]+ dark:bg-green-[0-9]+/[0-9]+', r'bg-cyan-400/30 dark:bg-cyan-900/40', orb2)
        orb2 = re.sub(r'bg-green-[0-9]+/[0-9]+', r'bg-cyan-400/30 dark:bg-cyan-900/40', orb2)
        return orb1 + orb2
        
    content = re.sub(glow_pattern, repl_glow, content)
    
    # Fix the remaining text colors that might be bad
    content = re.sub(r'text-slate-[456]00 dark:text-white', r'text-slate-800 dark:text-white', content)
    
    # Fix the logo brightness on light mode
    content = content.replace('brightness-200"', 'brightness-110 dark:brightness-200"')
    
    return content

for dir_path in directories:
    if not os.path.exists(dir_path):
        continue
    for filename in os.listdir(dir_path):
        if not filename.endswith('.tsx'):
            continue
        # Skip Landing.tsx since I just manually perfected it
        if filename == 'Landing.tsx':
            continue
            
        filepath = os.path.join(dir_path, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        content = rich_polish(content)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Rich polished {filepath}")

print("Done")
