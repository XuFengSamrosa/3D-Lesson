import os

def create_lesson(base_dir, lesson_id, module_name, title, desc, step1, step2, step3, step4, keywords, md_tips):
    folder_name = f"Lesson{lesson_id:02d}_{title.split(' - ')[0]}"
    folder_path = os.path.join(base_dir, folder_name)
    os.makedirs(folder_path, exist_ok=True)
    
    # 1. LessonPlan.md
    md_content = f"""# 8年级 | 第 {lesson_id} 课：{title} (教师手册)

## 0. 课前准备
- **核心工具**：Shapr3D (iPad/Windows) 或 Fusion 360，Bambu Studio
- **硬件材料**：游标卡尺、对应的实体展示教具
- **目标**：{desc}

---

## 1. 极客导入：工业原理 (10 分钟)
### {step1['title']}
- **教学重点**：{step1['point']}
- **互动环节**：{step1['interactive']}

---

## 2. 核心操作：参数化建模 (15 分钟)
### {step2['title']}
- **操作演示**：{step2['op']}
- **难点预警**：{step2['warning']}

---

## 3. 切片介入：数字与物理的边界 (10 分钟)
### {step3['title']}
- **设置参数**：{step3['settings']}
- **物理意义**：{step3['physics']}

---

## 4. 打印验证：缺陷与重生 (10 分钟)
### {step4['title']}
- **公差/尺寸验证**：{step4['tolerance']}
- **保存规范**：命名为 `L{lesson_id}_{title.split(' - ')[0]}_姓名.3mf`

---

## 教师提示 (Instructor Tips)：
{md_tips}
"""
    with open(os.path.join(folder_path, "LessonPlan.md"), "w", encoding="utf-8") as f:
        f.write(md_content)

    # 2. index.html
    html_content = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>未来设计师：{title.split(' - ')[0]}</title>
    <meta name="description" content="Grade 8 Lesson {lesson_id} - {desc}">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Noto+Sans+SC:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body class="presentation-mode">
    <nav id="nav-dots"></nav>
    <div id="scroll-container">
        
        <!-- Hero Section -->
        <section id="hero">
            <h1 class="main-title reveal">L{lesson_id}. {title.split(' - ')[0]}</h1>
            <p class="subtitle reveal delay-1">{title.split(' - ')[1] if ' - ' in title else desc}</p>
            <span class="tag reveal delay-2">MODULE: {module_name}</span>
            <div class="scroll-hint reveal delay-3">SCROLL TO INITIATE</div>
        </section>

        <!-- Concept Section -->
        <section id="concept">
            <h2 class="reveal">工业原纪</h2>
            <div class="comp-list reveal delay-1">
                <div class="comp">
                    <strong>{step1['title']}</strong>
                    <span>{step1['point']}</span>
                </div>
                <div class="comp">
                    <strong>KEYWORDS</strong>
                    <span>{keywords}</span>
                </div>
            </div>
        </section>

        <!-- Design Section -->
        <section id="design">
            <h2 class="reveal">参数化指令</h2>
            <div class="timeline-container reveal delay-1">
                <div class="timeline-node">
                    <span class="year">STEP 1</span>
                    <span class="event">{step2['title']} - {step2['op']}</span>
                </div>
                <div class="timeline-node">
                    <span class="year">WARNING</span>
                    <span class="event">{step2['warning']}</span>
                </div>
            </div>
        </section>

        <!-- Slicer Section -->
        <section id="slicer">
            <h2 class="reveal">切片覆盖</h2>
            <div class="params-grid reveal delay-1">
                <div class="param">> SETTINGS: {step3['settings']}</div>
                <div class="param">> PHYSICS: {step3['physics']}</div>
            </div>
        </section>

        <!-- Mission Section -->
        <section id="mission">
            <h2 class="reveal">极客任务</h2>
            <div class="comp-list reveal delay-1">
                <div class="comp" style="border-color: var(--accent);">
                    <strong>TARGET LOCK</strong>
                    <span>完成本节课模型建立与切片。</span>
                    <span>公差检定：{step4['tolerance']}</span>
                </div>
                <div class="comp" style="border-color: var(--purple);">
                    <strong>EXPORT FILE</strong>
                    <span>L{lesson_id}_{title.split(' - ')[0]}_姓名.3mf</span>
                </div>
            </div>
        </section>
        
    </div>
    <script src="../assets/script.js"></script>
</body>
</html>
"""
    with open(os.path.join(folder_path, "index.html"), "w", encoding="utf-8") as f:
        f.write(html_content)

print("Template builder loaded.")
