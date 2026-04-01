import os
import re

# 映射配置
folder_renames = {
    "Lesson01_魔法打印机初探": "Lesson01_初识数字制造",
    "Lesson05_神奇的莫比乌斯环": "Lesson05_几何空间奥秘"
}

text_replacements = {
    "魔法打印机": "智能3D打印机",
    "魔法师": "创客",
    "老法师": "人工智能助手",
    "魔法工坊": "数字实验室",
    "魔法": "数字设计",
    "神奇": "奥秘",
    "变魔法": "数字化制造",
    "咒语": "设计指令",
    "魔法之门": "实验室入口",
    "🔮": "🤖",
    "✨": "⚙️",
    "🪄": "🛠️",
    "3D魔法卷轴": "3D创客工坊"
}

def de_magic_grade3(base_path):
    print(f"Starting de-magic at {base_path}...")
    
    # 1. 重命名文件夹
    for old_name, new_name in folder_renames.items():
        old_p = os.path.join(base_path, old_name)
        new_p = os.path.join(base_path, new_name)
        if os.path.exists(old_p) and not os.path.exists(new_p):
            os.rename(old_p, new_p)
            print(f"Renamed folder: {old_name} -> {new_name}")

    # 2. 遍历所有 Lesson 文件夹进行内容替换
    folders = [d for d in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, d)) and 'Lesson' in d]
    
    for folder in folders:
        folder_path = os.path.join(base_path, folder)
        print(f"Processing folder: {folder}")
        
        for filename in ['index.html', 'style.css', 'script.js', 'LessonPlan.md']:
            file_path = os.path.join(folder_path, filename)
            if not os.path.exists(file_path): continue
            
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 执行所有替换
            new_content = content
            for old_text, new_text in text_replacements.items():
                new_content = new_content.replace(old_text, new_text)
            
            # 特殊处理 HTML 标题
            new_content = re.sub(r'<title>(.*?)</title>', lambda m: m.group(0).replace("魔法", "创客"), new_content)
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"  Updated: {filename}")

if __name__ == "__main__":
    de_magic_grade3("Grade3_JuniorMaker")
    print("De-magic completedly efficiently.")
