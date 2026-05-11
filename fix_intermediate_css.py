"""
Batch fix all Intermediate_FutureDesigner lesson HTML files:
1. Replace inline <style>...</style> with <link rel="stylesheet" href="../assets/style.css">
2. Keep inline script as-is
"""
import os, re, glob

LESSONS_DIR = "/Users/samrosa/DEV/3D/Intermediate_FutureDesigner"

# Pattern to match inline <style> block + optional lesson-visual styles
# The inline style always starts at line 9 and goes to </style>
STYLE_PATTERN = re.compile(
    r'    <style>\n.*?</style>',
    re.DOTALL
)

REPLACEMENT = '    <link rel="stylesheet" href="../assets/style.css">'

count = 0
for lesson_dir in sorted(glob.glob(os.path.join(LESSONS_DIR, "Lesson*"))):
    html_path = os.path.join(lesson_dir, "index.html")
    if not os.path.isfile(html_path):
        continue
    
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<style>' not in content:
        print(f"SKIP (no inline style): {os.path.basename(lesson_dir)}")
        continue
    
    new_content = STYLE_PATTERN.sub(REPLACEMENT, content, count=1)
    
    if new_content == content:
        print(f"WARNING: pattern did not match: {os.path.basename(lesson_dir)}")
        continue
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    count += 1
    print(f"FIXED: {os.path.basename(lesson_dir)}")

print(f"\nTotal fixed: {count} files")
