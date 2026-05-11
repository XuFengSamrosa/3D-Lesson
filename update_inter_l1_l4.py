import os
import shutil
import re

BASE_DIR = "/Users/samrosa/DEV/3D/Intermediate_FutureDesigner"
ASSETS_DIR = os.path.join(BASE_DIR, "assets", "images")
os.makedirs(ASSETS_DIR, exist_ok=True)

IMAGES = {
    "Lesson01": ("/Users/samrosa/.gemini/antigravity/brain/d86c0d5e-eb66-4d3c-a532-2fd514e9b29d/inter_l1_xyz_caliper_1777190814520.jpg", "l1_caliper.jpg"),
    "Lesson02": ("/Users/samrosa/.gemini/antigravity/brain/d86c0d5e-eb66-4d3c-a532-2fd514e9b29d/inter_l2_sketch_constraints_1777190828152.jpg", "l2_sketch.jpg"),
    "Lesson03": ("/Users/samrosa/.gemini/antigravity/brain/d86c0d5e-eb66-4d3c-a532-2fd514e9b29d/inter_l3_caliper_measure_1777190852236.jpg", "l3_measure.jpg"),
    "Lesson04": ("/Users/samrosa/.gemini/antigravity/brain/d86c0d5e-eb66-4d3c-a532-2fd514e9b29d/inter_l4_boolean_3d_1777190866338.jpg", "l4_boolean.jpg")
}

# Copy images
for lesson, (src, dest) in IMAGES.items():
    if os.path.exists(src):
        shutil.copy(src, os.path.join(ASSETS_DIR, dest))

# Data to optimize L1 to L4
OPTIMIZED_DATA = {
    "Lesson01_物理原纪": {
        "title": "L1. 物理原纪 (Physical Origins)",
        "subtitle": "工具的进化与三维坐标系的绝对映射",
        "img_name": "l1_caliper.jpg",
        "concept1": "告别肉眼估测，掌控 0.01mm 精度",
        "concept1_desc": "游标卡尺三维法则：外爪测外径(X/Y)，内爪探孔径，尾针测深度(Z)。测量时必须卡紧实物最宽点，读数不要四舍五入！",
        "concept2": "三维空间映射 (XYZ Axes)",
        "concept2_desc": "物理世界没有上下左右。在 CAD 中：前视基准面=XY平面，上视=XZ，右视=YZ。所有的生命必须从 [原点 Origin] 诞生。",
        "step1": "鼠标空间重载：按住鼠标中键(滚轮)拖动 = 旋转视角；按住 Ctrl + 中键拖动 = 平移画面。先习惯在虚空中不迷失方向！",
        "step2": "选择 [前视基准面]，点击草图绘制。第一笔必须点击中心那个发红光的 [时空十字(原点)]。",
        "step_warn": "禁忌法则：永远不要在空中悬浮乱画！没有任何基准约束的线条在工业界被称为“幽灵实体”。",
        "slicer_set": "模型导出前检查：在特征树点击“质量属性”，确保模型体积 > 0。STL 只认识三角面，不认识线段！",
        "slicer_phy": "降维打击：切片软件 Bambu Studio 会将 3D 实体沿 Z 轴切割成几百张 2D 的横截面(层高 0.2mm)。",
        "mission_target": "使用卡尺测量你手边的一个硬币或方块。在 CAD 中以原点为中心，精确画出它的外轮廓，尺寸误差必须控制在 0.1mm 以内！",
    },
    "Lesson02_草图法则": {
        "title": "L2. 草图法则 (Sketch Constraints)",
        "subtitle": "不要相信眼睛，去相信系统底层的几何数学",
        "img_name": "l2_sketch.jpg",
        "concept1": "约束的绝对力量",
        "concept1_desc": "在屏幕上看着像平行没用！必须框选两条线，在左侧属性栏点击 [平行 Parallel] 或 [垂直 Perpendicular]。",
        "concept2": "草图的生命周期 (Blue to Black)",
        "concept2_desc": "蓝色线条 = 欠定义(随时会变形崩溃)；黑色线条 = 完全定义(被死死锁定)。我们的目标是全黑！",
        "step1": "几何优先法则：画出一个扭曲的三角形。按住 Ctrl 选中底边，点击【水平】；选中两腰，点击【相等】。奇迹发生了。",
        "step2": "尺寸终压：几何约束做完后，最后使用【智能尺寸】标注底边长度 50mm。整个图形瞬间变成绝对锁定的黑色！",
        "step_warn": "警告：轮廓必须完全闭合！放大检查是否有线头交叉或断口（开口轮廓）。漏水的池子是没法注水成 3D 的！",
        "slicer_set": "失败演绎：尝试导出一条二维直线给 Bambu Studio。切片机会报错：这是一个没有物理质量的零维幽灵！",
        "slicer_phy": "空间悖论：二维草图必须通过 Z 轴方向的力（如拉伸、旋转）才能突破维度，获得实体的肉身。",
        "mission_target": "绘制一个 50x30 的矩形，内部包含两个 Ø10 的圆。要求：两个圆必须通过 [相等] 约束绑定，只能标注一个圆的尺寸。拉扯线条验证其绝对刚性！",
    },
    "Lesson03_工程卡尺": {
        "title": "L3. 逆向重构 (Reverse Engineering)",
        "subtitle": "从物理实体到数字原型的拉伸解码",
        "img_name": "l3_measure.jpg",
        "concept1": "信息采集与逆向工程",
        "concept1_desc": "工业界没有凭空捏造。用数显卡尺死死卡住目标零件，读取 X(长) 50.50mm, Y(宽) 30.20mm。数据即是一切。",
        "concept2": "突破维度的【拉伸 Extrude】",
        "concept2_desc": "在完全闭合的 XY 草图上，施加 Z 轴方向的生长力。输入厚度参数，二维图纸瞬间隆起成为三维砖块。",
        "step1": "画地为牢：在前视基准面画出实测的 50.5 x 30.2 矩形（全黑）。退出草图。",
        "step2": "拔地而起：点击【特征】->【拉伸凸台/基体】。必须点选那个会发光的草图内圈！",
        "step_warn": "致命错误：如果在拉伸时选中的是“边缘线（薄壁特征）”，你拉出来的将是一个中空的纸皮箱子！必须选内部区域。",
        "slicer_set": "导入 Bambu Studio：在右上角选择“切片”，观察预计消耗的耗材质量（克）。",
        "slicer_phy": "成本控制法则：你的每一次拉伸都在燃烧材料！把内部填充率从 15% 提高到 50%，观察重量和时间的暴增。",
        "mission_target": "逆向测绘你身边的一个长方体充电头（或橡皮擦），在 CAD 中完美复刻它的外形，并拉伸出精确的高度 Z。",
    },
    "Lesson04_立体解码": {
        "title": "L4. 虚无之刃 (Boolean Subtraction)",
        "subtitle": "用拉伸切除与布尔运算雕刻物质",
        "img_name": "l4_boolean.jpg",
        "concept1": "物质的消亡 (Extruded Cut)",
        "concept1_desc": "雕塑的核心在于“去除多余的材料”。在已有实体的表面画图，然后使用【拉伸切除】向下挖空物质。",
        "concept2": "布尔运算逻辑",
        "concept2_desc": "A - B = C。主实体 A 减去我们画的切除圆柱体 B，最终得到带孔的实体 C。",
        "step1": "寻找着陆点：不要选三大基准面了！这次直接用鼠标左键点击你刚刚拉伸出来的长方体【上表面】，在此处新建草图。",
        "step2": "画出空洞：在表面画一个 Ø10mm 的圆。点击【特征】->【拉伸切除】。",
        "step_warn": "深度陷阱：在切除属性栏里，不要傻傻地输入深度数字！下拉菜单选择【完全贯穿 Through All】，这样不管方块多厚，孔永远能打穿！",
        "slicer_set": "打印中空结构：孔洞是切片软件的噩梦。切片后，拖动右侧的层进度条，观察喷头是如何绕着孔洞画圆圈的。",
        "slicer_phy": "如果孔的走向是水平悬空的（桥接），3D打印机在空中吐丝会下垂。但我们这次是垂直孔，重力对它无效！",
        "mission_target": "在 L3 做的充电头实体上，用【拉伸切除】打穿两个 Ø5mm 的散热孔，并用卡尺验证孔径与孔距的精确度！",
    }
}

IMG_STYLE = """
        /* 注入的图片样式 */
        .lesson-visual {
            width: 100%;
            max-width: 900px;
            margin: 3rem auto;
            border-radius: 12px;
            border: 1px solid var(--accent);
            box-shadow: 0 0 40px rgba(34, 211, 238, 0.2);
            overflow: hidden;
            position: relative;
            transform: translateX(-30px);
            opacity: 0;
            transition: all 1s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .lesson-visual.visible { transform: translateX(0); opacity: 1; }
        .lesson-visual img {
            width: 100%;
            height: auto;
            display: block;
            mix-blend-mode: screen; /* 与深色背景完美融合 */
        }
        .lesson-visual::after {
            content: 'VISUAL DATASTREAM ACTIVE';
            position: absolute;
            bottom: 10px;
            right: 15px;
            font-family: monospace;
            font-size: 0.8rem;
            color: var(--accent);
            letter-spacing: 2px;
            background: rgba(0,0,0,0.7);
            padding: 4px 8px;
            border-radius: 4px;
        }
"""

for root, dirs, files in os.walk(BASE_DIR):
    for file in files:
        if file == "index.html":
            lesson_name = os.path.basename(root)
            if lesson_name in OPTIMIZED_DATA:
                data = OPTIMIZED_DATA[lesson_name]
                filepath = os.path.join(root, file)
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Add CSS
                if ".lesson-visual" not in content:
                    content = content.replace("</style>", IMG_STYLE + "</style>")

                # Replace Title & Subtitle
                content = re.sub(r'<h1 class="main-title reveal">.*?</h1>', f'<h1 class="main-title reveal">{data["title"]}</h1>', content)
                content = re.sub(r'<p class="subtitle reveal delay-1">.*?</p>', f'<p class="subtitle reveal delay-1">{data["subtitle"]}</p>', content)
                
                # Replace Concept 1 & 2
                concept_html = f"""<div class="comp-list reveal delay-1">
                <div class="comp">
                    <strong>{data["concept1"]}</strong>
                    <span>{data["concept1_desc"]}</span>
                </div>
                <div class="comp">
                    <strong>{data["concept2"]}</strong>
                    <span>{data["concept2_desc"]}</span>
                </div>
            </div>"""
                content = re.sub(r'<div class="comp-list reveal delay-1">.*?</div>\s*</section>', concept_html + "\n</section>", content, flags=re.DOTALL, count=1)

                # Inject Image right before scroll-hint
                img_tag = f'\n            <div class="lesson-visual reveal delay-2"><img src="../assets/images/{data["img_name"]}" alt="Lesson Visual"></div>\n'
                if "lesson-visual" not in content:
                    content = content.replace('<div class="scroll-hint reveal delay-3">SCROLL TO INITIATE</div>', img_tag + '            <div class="scroll-hint reveal delay-3">SCROLL TO INITIATE</div>')

                # Replace Timeline (Steps)
                steps_html = f"""<div class="timeline-container reveal delay-1">
                <div class="timeline-node">
                    <span class="year">STEP 1</span>
                    <span class="event">{data["step1"]}</span>
                </div>
                <div class="timeline-node">
                    <span class="year">STEP 2</span>
                    <span class="event">{data["step2"]}</span>
                </div>
                <div class="timeline-node">
                    <span class="year">WARNING</span>
                    <span class="event" style="color: var(--danger);">{data["step_warn"]}</span>
                </div>
            </div>"""
                content = re.sub(r'<div class="timeline-container reveal delay-1">.*?</div>\s*</section>', steps_html + "\n</section>", content, flags=re.DOTALL)

                # Replace Slicer Grid
                slicer_html = f"""<div class="params-grid reveal delay-1">
                <div class="param">> SETTINGS: {data["slicer_set"]}</div>
                <div class="param">> PHYSICS: {data["slicer_phy"]}</div>
            </div>"""
                content = re.sub(r'<div class="params-grid reveal delay-1">.*?</div>\s*</section>', slicer_html + "\n</section>", content, flags=re.DOTALL)

                # Replace Mission
                mission_html = f"""<div class="comp-list reveal delay-1">
                <div class="comp" style="border-color: var(--accent);">
                    <strong>TARGET LOCK</strong>
                    <span>{data["mission_target"]}</span>
                </div>
                <div class="comp" style="border-color: var(--purple);">
                    <strong>EXPORT FILE (系统档案上传协议)</strong>
                    <span>{lesson_name}_姓名.3mf</span>
                </div>
            </div>"""
                # find the last comp-list which is mission
                content = re.sub(r'<!-- Mission Section -->.*?<div class="comp-list reveal delay-1">.*?</div>\s*</section>', 
                                 f'<!-- Mission Section -->\n        <section id="mission">\n            <h2 class="reveal">极客核心试炼</h2>\n            {mission_html}\n        </section>', 
                                 content, flags=re.DOTALL)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)

print("L1-L4 of Intermediate Course perfectly updated with precise actionable data and tailored images.")
