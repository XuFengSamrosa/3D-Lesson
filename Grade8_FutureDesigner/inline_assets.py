import os
import glob

base_dir = "/Users/samrosa/DEV/3D/Grade8_FutureDesigner"
with open(os.path.join(base_dir, "assets/style.css"), "r") as f:
    css_content = f.read()

with open(os.path.join(base_dir, "assets/script.js"), "r") as f:
    js_content = f.read()

html_files = glob.glob(os.path.join(base_dir, "Lesson*", "index.html"))

for html_file in html_files:
    with open(html_file, "r") as f:
        content = f.read()
    
    if '<link rel="stylesheet" href="../assets/style.css">' in content:
        content = content.replace(
            '<link rel="stylesheet" href="../assets/style.css">',
            f"<style>\n{css_content}\n</style>"
        )
        
    if '<script src="../assets/script.js"></script>' in content:
        content = content.replace(
            '<script src="../assets/script.js"></script>',
            f"<script>\n{js_content}\n</script>"
        )
        
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Inlined CSS/JS for {len(html_files)} files.")
