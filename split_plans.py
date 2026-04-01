import os
import re

def split_plans(master_file, base_dir, grade_name):
    with open(master_file, 'r') as f:
        content = f.read()
    
    # 匹配 "## 第 X 课" 或类似章节
    # 假设汇总教案是以 "## 第 X 课" 或 "# 第 X 课" 开头的
    lessons = re.split(r'\n(?=#+ 第\d+课)|(?=#+ 第 \d+ 课)', content)
    
    # 排除开头的非课程内容
    lessons = [l for l in lessons if '课' in l]

    # 获取现有文件夹列表
    folders = sorted([d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d)) and 'Lesson' in d])

    for i, lesson_content in enumerate(lessons):
        if i < len(folders):
            folder_path = os.path.join(base_dir, folders[i])
            # 如果是第1课，我们使用之前深度开发的详细教案，所以跳过
            if 'Lesson01' in folders[i]: continue
            
            with open(os.path.join(folder_path, 'LessonPlan.md'), 'w') as f:
                f.write(lesson_content.strip())
            print(f"Generated LessonPlan.md for {folders[i]}")

# 执行拆分
split_plans('Grade3_JuniorMaker/Grade3_LessonPlans.md', 'Grade3_JuniorMaker', 'Grade3')
split_plans('Grade8_FutureDesigner/Grade8_LessonPlans.md', 'Grade8_FutureDesigner', 'Grade8')
