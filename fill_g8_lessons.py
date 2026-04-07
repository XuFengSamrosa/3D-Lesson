import os

base_path = '/Users/fengxu/Documents/dev/PPT/Grade8_FutureDesigner'

lessons = [
    ("Lesson03_复杂装配与模块逻辑", "复杂装配与模块逻辑", "探讨模块化设计的装配逻辑，在 XYZ 坐标系中进行精准定位与公差考量。", "📐 STEP 01: 设计模块化底盘并设定基准面。\n⚙️ STEP 02: 建立多组件层级与旋转平移逻辑。\n🔧 STEP 03: 导出完整组件组并进行切片干涉分析。"),
    ("Lesson04_参数化几何与布尔运算", "参数化几何与布尔运算", "解析实体建模中的布尔加减法算法原理，实现复杂的特征重组与切割。", "➕ STEP 01: 利用布尔并集熔接基础块。\n➖ STEP 02: 运用布尔差集开制精准孔洞与凹槽。\n✖️ STEP 03: 通过交集保留核心特征块并优化打印姿态。"),
    ("Lesson05_空间拓扑与莫比乌斯环", "空间拓扑与莫比乌斯环", "引入基础拓扑学概念，利用放样与扫掠展现空间单面几何之美。", "🌀 STEP 01: 绘制核心引导路径草图。\n✏️ STEP 02: 定义不同截面的放样参数。\n✨ STEP 03: 生成莫比乌斯环拓扑结构并进行高精度切片。"),
    ("Lesson06_阵列偏移与工业收纳", "阵列偏移与工业收纳", "借助阵列与偏移公式实现量产化模型的快速生成，理解壁厚与结构强度的关系。", "📦 STEP 01: 创建基础的收纳盒外壳模具。\n📏 STEP 02: 利用等距偏移快速生成内部空腔。\n🗄️ STEP 03: 线性阵列隔板，完成多格工业收纳箱。"),
    ("Lesson07_路径阵列与模块系统", "路径阵列与模块系统", "在复合曲线路径上运用阵列生成规则系统，构建具有功能性的重复构件。", "🛤️ STEP 01: 设计复杂的引导曲线路径。\n🔗 STEP 02: 搭建基础的机械连杆模块。\n🔄 STEP 03: 应用路径阵列生成履带或护栏系统。"),
    ("Lesson08_物理模拟与动态零件", "物理模拟与动态零件", "以旋转陀螺为例，分析重心、角动量与空气动力学在几何中的体现。", "⚖️ STEP 01: 设定旋转中心对称轴。\n🌪️ STEP 02: 使用回转特征快速生成多流线轮廓。\n🎯 STEP 03: 底部加装重心配重块设计。"),
    ("Lesson09_复杂纹理与光影工程", "复杂纹理与光影工程", "运用薄壁切除与阵列镂空，探索3D模型在光影投射下的视觉系统重构。", "💡 STEP 01: 建立曲面灯罩基础壳体。\n✂️ STEP 02: 环孔阵列与布尔减法结合制作镂空。\n🌟 STEP 03: 在切片软件中进行薄壁与花瓶模式参数调优。"),
    ("Lesson10_机械联动与可动结构", "机械联动与可动结构", "挑战“一枪打出”的免组装结构，精确规划球头关节与万向轴的容错间隙。", "🤖 STEP 01: 设计活动关节的基本球头与球碗。\n🔬 STEP 02: 在模型库中预留 0.2~0.3mm 的公差间隙。\n⚙️ STEP 03: 整体验证并分析关节层间的悬垂支撑。"),
    ("Lesson11_机械公差与斜面建模", "机械公差与斜面建模", "面对不规则受力平面，构建稳固的重力支持系统，处理斜面交接处的精度退化。", "📐 STEP 01: 寻找并建立斜面基准工作区。\n🏗️ STEP 02: 创建三角支撑底盘防倾翻设计。\n🧲 STEP 03: 切片中调整层高以避免斜面出现“台阶效应”。"),
    ("Lesson12_逆向工程与适配系统", "逆向工程与适配系统", "应用游标卡尺测绘真实物理环境尺寸，将现实世界物理反馈逆向转化为数字模型。", "📏 STEP 01: 根据实物进行多维尺寸测绘（长宽高与内径）。\n🧩 STEP 02: 设计无缝卡扣结构与插接卡槽。\n🔄 STEP 03: 结合现实模型（如手机或设备）进行逆向适配迭代。"),
    ("Lesson13_未来都市_系统规划", "未来都市：系统规划", "引入超大规模的团队级别建设，制定统一底层接口与标准比例尺规划。", "🏙️ STEP 01: 全班确立统一的城市底层插接标准接口。\n🗺️ STEP 02: 网格化道路系统与高低落差地形制图。\n🤝 STEP 03: 划分小组责任区块与建筑主题规划。"),
    ("Lesson14_未来都市_集成建模", "未来都市：集成建模", "在标准体系下进行建筑组件开发，关注宏观集成设计中的几何容差问题。", "🏗️ STEP 01: 制作建筑主体及特色屋顶模块系统。\n🪟 STEP 02: 进行精细化开窗与道路对接细节修整。\n🔗 STEP 03: 确保接口对齐，进行误差修正与布尔重组。"),
    ("Lesson15_未来都市_生产工程", "未来都市：生产工程", "进入大型项目的批量化生产流，聚焦于耗材排布计算、时长优化与分包下线。", "🏭 STEP 01: 多模型集中排版与耗材省流算法调优。\n🛠️ STEP 02: 大规模支撑脱落分析与预测试打印。\n🚚 STEP 03: 组件装配、打磨及实体模型联调纠错。"),
    ("Lesson16_未来都市_成果演示", "未来都市：成果演示", "技术架构审查与演示复盘，验证方案从概念设计到落地成型的完整生命周期。", "🎬 STEP 01: 整理渲染导出文件，准备设计逻辑说明图谱。\n🎤 STEP 02: 小组上台进行工程审查（评审与问题解答）。\n🚀 STEP 03: 总装完成，开启造物主灯光效果，总结学期成果。")
]

template_html = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>第{idx}课: {title} - 8年级</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;900&family=Noto+Sans+SC:wght@300;400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body class="cyber-presentation">
    <nav class="cyber-nav">
        <ul>
            <li class="nav-diamond active" data-target="hero" title="SYS.INIT"></li>
            <li class="nav-diamond" data-target="concept" title="技术解码"></li>
            <li class="nav-diamond" data-target="practical" title="工程实践"></li>
            <li class="nav-diamond" data-target="outro" title="思维跃迁"></li>
        </ul>
    </nav>
    <div id="scroll-universe">
        <section id="hero" class="cyber-section centered">
            <div class="glitch-wrapper">
                <div class="sys-label cyber-fade-up">SYS.INIT // L{idx:02d}</div>
                <h1 class="mega-title cyber-glitch cyber-fade-up delay-1" data-text="{title}">{title}</h1>
                <p class="subtitle cyber-fade-up delay-2">FUTURE DESIGNER LABORATORY</p>
                <div class="scroll-blinker cyber-fade-up delay-3">[ SCROLL TO BEGIN ]<span class="terminal-cursor">_</span></div>
            </div>
        </section>
        <section id="concept" class="cyber-section">
            <div class="container split-layout">
                <div class="text-panel cyber-fade-up">
                    <div class="sys-label highlight">CONCEPT.DECODE</div>
                    <h2 class="section-title">技术原理验证</h2>
                    <p class="section-desc">{desc}</p>
                </div>
                <div class="data-panel cyber-fade-up delay-1">
                    <div class="cyber-wireframe-display">
                        <div class="circle-radar"></div>
                        <div class="circle-inner"></div>
                        <div class="data-scanline"></div>
                        <div class="overlay-text">ANALYZING SYSTEMS...</div>
                    </div>
                </div>
            </div>
        </section>
        <section id="practical" class="cyber-section">
            <div class="container text-center">
                 <div class="sys-label highlight mb-4">PRACTICE.ENGINEERING</div>
                 <h2 class="section-title">Shapr3D 高级建模挑战</h2>
                 <p class="section-desc mb-5">运用极致的参数化统筹逻辑完成核心工程结构的组建。</p>
                 <div class="blueprint-box text-left">
                    {steps_html}
                 </div>
            </div>
        </section>
        <section id="outro" class="cyber-section centered">
            <div class="glitch-wrapper">
                <div class="sys-label cyber-fade-up">SYS.UPDATE // LOGIC</div>
                <h1 class="mega-title cyber-glitch cyber-fade-up delay-1" data-text="制造起航">制造起航</h1>
                <p class="subtitle cyber-fade-up delay-2">WITNESS THE POWER OF DESIGN</p>
            </div>
        </section>
    </div>
    <script src="script.js"></script>
</body>
</html>"""

template_md = """# 8 年级 | 第 {idx} 课：{title} (教师版)

## 教学核心
- **主题**：{title}
- **工具**：Shapr3D, Bambu Studio
- **目标**：{desc}

## 核心环节安排
1. **理论与体系导入**：结合网页极客演示界面，探讨现代工业设计体系下的解决路径。
2. **建模挑战工作坊**：
{steps_md}
3. **制造验证预处理**：在切片软件中进行高级参数（支撑、层高、速度控制）的验证，以适配复杂模型。

## 教师提示与雷区
- **容差**：8年级项目重在结构耦合，须着重提醒 0.2mm 公差间隙，防止模型打印死锁或无法拼合。
- **效率**：复杂几何非常容易在切片时生成过量支撑，需要引导学生运用悬垂角度规则（大于 45 度无需支撑），提前优化模型截面。
"""

for idx, (folder, title, desc, steps) in enumerate(lessons, start=3):
    dir_path = os.path.join(base_path, folder)
    # 处理 HTML
    steps_lines = steps.split('\\n')
    steps_html = '\\n                    '.join([f'<div class="blueprint-line">{s}</div>' for s in steps_lines])
    html_content = template_html.format(idx=idx, title=title, desc=desc, steps_html=steps_html)
    
    with open(os.path.join(dir_path, 'index.html'), 'w') as f:
        f.write(html_content)
        
    # 处理 MD
    steps_md = '\\n'.join([f"    - {s.split(': ', 1)[1]}" for s in steps_lines])
    md_content = template_md.format(idx=idx, title=title, desc=desc, steps_md=steps_md)
    
    with open(os.path.join(dir_path, 'LessonPlan.md'), 'w') as f:
        f.write(md_content)

print("✅ 所有 3~16 课室的核心教案与数字演示前端注入完毕！")
