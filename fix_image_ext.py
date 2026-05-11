import os

def fix_extensions(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith((".html", ".py")):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content.replace('.jpg', '.jpg')
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")

if __name__ == "__main__":
    fix_extensions("/Users/samrosa/DEV/3D/Advanced_HardcoreEngineer")
    fix_extensions("/Users/samrosa/DEV/3D") # also fix rebuild_advanced_course.py and optimize_prog_lessons.py
