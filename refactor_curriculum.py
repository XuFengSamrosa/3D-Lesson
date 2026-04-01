import os
import shutil

# 定义数据
g3_data = [
    ("Lesson01_魔法打印机初探", ["欢迎来到魔法工坊！", "认识新伙伴：拓竹 A1", "安全第一：不能摸的部分", "见证奇迹：第一个小方块"]),
    ("Lesson02_我的名字徽章", ["我们要有自己的徽章！", "写下名字：变高魔法", "Shapr3D：捏捏看", "切片秘密：糖果色打印"]),
    ("Lesson03_积木搭建大师", ["乐高挑战：搭建城堡", "方块与圆柱：好朋友", "对齐魔法：站稳了吗？", "空间大冒险：旋转视角"]),
    ("Lesson04_几何动物园", ["变个魔术：抠洞洞", "小耳朵猪：怎么变？", "布尔运算：加法与减法", "多彩世界：小猪穿彩衣"]),
    ("Lesson05_神奇的莫比乌斯环", ["无尽空间：神奇纸带", "扭转魔法：一个面的世界", "路径扫描：丝滑成型", "数学之美：莫比乌斯环"]),
    ("Lesson06_桌面小管家", ["给文具找个家", "精确输入：量量你的橡皮", "偏移技巧：制作空盒子", "功能装饰：专属名字刻印"]),
    ("Lesson07_迷你景观配件", ["多肉植物的小邻居", "路径阵列：整齐的栅栏", "指路牌设计：文字投影", "支撑探秘：给模型穿马甲"]),
    ("Lesson08_旋转陀螺大赛", ["寻找重心：为什么会转？", "回转工具：一圈变主体", "平衡设计：两边要一样重", "极速竞技：谁转得最久"]),
    ("Lesson09_镂空灯罩设计", ["光影魔术师", "环孔阵列：对称的花纹", "布尔减法：剪纸特效", "温馨时刻：透光效果展示"]),
    ("Lesson10_关节可动小人", ["动起来：模仿你的关节", "球头结构：灵活的转动", "公差预留：不要粘在一起", "免组装挑战：打印即活动"]),
    ("Lesson11_创意手机支架", ["手机的指挥椅", "斜面画图：寻找最佳角度", "稳固支撑：底部加重设计", "个性造型：动物形支架"]),
    ("Lesson12_拓竹A1大变身", ["我是打印机小管家", "卡扣结构：精准的U型槽", "实用小工具：刮刀架设计", "色彩点缀：多色附件制作"]),
    ("Lesson13_梦想社区规划", ["我们都是城市规划师", "团队分工：各司其职", "比例统一：大家的比例尺", "蓝图绘制：社区的主题"]),
    ("Lesson14_梦想社区建模", ["建造我们的小房子", "细节打磨：路灯与喷泉", "组件合并：大家的作品", "精益求精：修整模型边缘"]),
    ("Lesson15_打印与组装", ["大规模生产：摆满打印板", "切片大师：节省线材技巧", "清理工作：去掉支撑的部分", "初步合体：各小组作品汇总"]),
    ("Lesson16_作品发布会", ["小小市长点亮城市", "设计分享：我的闪光点", "团队之星：我们的协作故事", "魔法结业：首席架构师奖"])
]

g8_data = [
    ("Lesson01_增材制造与工业4.0", ["THE FUTURE OF MANUFACTURING", "BAMBU LAB A1: THE CORE TECH", "INDUSTRIAL SLICING LOGIC", "INFILL vs STRENGTH"]),
    ("Lesson02_精确建模", ["GEOMETRIC CONSTRAINTS", "DIMENSIONING & CONSTANTS", "PARAMETRIC DESIGN FLOW", "STEP vs STL PROTOCOL"]),
    ("Lesson03_AI辅助创意", ["GENERATIVE AI IDEATION", "EXTRACTING FORM FROM SKETCH", "SPLINE & CURVE MASTERING", "HUMAN-AI WORKFLOW"]),
    ("Lesson04_机械铰链", ["HINGE & JOINT DYNAMICS", "TOLERANCE & GAP CONTROL", "PRINT-IN-PLACE STRUCTURE", "ITERATIVE OPTIMIZATION"]),
    ("Lesson05_人体工程学", ["CURVED SURFACE MODELING", "LOFTING THROUGH CROSS SECTIONS", "TANGENT CONTROL", "USER INTERFACE COMFORT"]),
    ("Lesson06_建筑结构挑战", ["TRUSS BRIDGE ENGINEERING", "LOAD-BEARING ANALYSIS", "REDUNDANCY IN DESIGN", "STRENGTH vs WEIGHT RATIO"]),
    ("Lesson07_AI参数化纹理", ["AI-DRIVEN TEXTURE GEN", "VORONOI & TURING PATTERNS", "SURFACE PROJECTION MAPPING", "HIGH-POLY SLICING STRATEGY"]),
    ("Lesson08_极简主义花瓶", ["SWEEPING ALONG 3D PATHS", "SHELL TOOL FOR UNIFORM WALLS", "STREAMLINED INDUSTRIAL FORM", "VAS MODE (SPIRAL) PRINTING"]),
    ("Lesson09_逆向设计应用", ["FIT-TO-REAL PRECISION", "OFFSET & CLEARANCE CALCULATIONS", "REVERSE MODELING FROM SCANS", "ADAPTIVE CASE DESIGN"]),
    ("Lesson10_齿轮传动机构", ["GEAR RATIO & MODULUS", "MESHING GAP TOLERANCE", "TRANSMISSION EFFICIENCY", "3D PRINTED FRICTION CONTROL"]),
    ("Lesson11_AMS多色策略", ["AI-ASSISTED COLOR GRADING", "BODY-BASED COLOR ASSIGNMENT", "FLUSH VOLUME OPTIMIZATION", "MULTI-BODY EXPORT LOGIC"]),
    ("Lesson12_仿生轻量化", ["HONEYCOMB & LATTICE INFILL", "STRUCTURAL OPTIMIZATION", "BIO-MIMICRY IN ENGINEERING", "MATERIAL SAVING STRATEGY"]),
    ("Lesson13_智能硬件外壳I", ["INTERNAL COMPONENT LAYOUT", "HEAT DISSIPATION CHANNELS", "SCREW HOLE & SNAP FIT", "ITERATIVE PROTOTYPING"]),
    ("Lesson14_智能硬件外壳II", ["BUTTON TACTILE FEEDBACK", "CABLE MANAGEMENT SLOTS", "USER EXPERIENCE REFINEMENT", "FINAL ASSEMBLY VALIDATION"]),
    ("Lesson15_未来城市单体", ["FUTURISTIC ARCHITECTURE", "SYSTEM INTEGRATION DESIGN", "SCALING & PROPORTION", "MODULAR URBAN PLANNING"]),
    ("Lesson16_综合项目路演", ["DESIGN LOGIC PRESENTATION", "TECHNICAL CHALLENGE SOLVING", "PEER REVIEW & FEEDBACK", "THE FUTURE OF CREATION"])
]

def generate_lesson(grade_path, folder_name, slides, lesson_idx, is_detailed=False):
    path = os.path.join(grade_path, folder_name)
    if not os.path.exists(path): os.makedirs(path)
    
    # 样式文件拷贝
    shutil.copy(os.path.join(grade_path, 'style.css'), os.path.join(path, 'style.css'))
    
    # HTML 生成
    title = f"第{lesson_idx+1}课 - {folder_name}"
    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>{title}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav id="nav-dots"></nav>
    <div id="app">
        <main id="scroll-container">
            <section class="hero" id="intro">
                <div class="reveal">
                    <h1>{folder_name}</h1>
                    <p class="subtitle">Lesson {lesson_idx+1}</p>
                </div>
            </section>
            <div id="lesson-sections"></div>
        </main>
    </div>
    <script src="script.js"></script>
</body>
</html>"""
    with open(os.path.join(path, 'index.html'), 'w') as f: f.write(html)

    # JS 生成 (逻辑提取)
    js_content = f"const lessonData = {slides};\n" + """
const lessonContainer = document.getElementById('lesson-sections');
const navDotsContainer = document.getElementById('nav-dots');
function init() { renderContent(); setupIntersectionObserver(); }
function renderContent() {
    createDot('intro', '首页');
    lessonData.forEach((slideText, sIdx) => {
        const sectionId = `slide-${sIdx}`;
        const section = document.createElement('section');
        section.id = sectionId;
        section.innerHTML = `<div class="reveal"><h2>${slideText}</h2></div>`;
        lessonContainer.appendChild(section);
        createDot(sectionId, `Slide ${sIdx + 1}`);
    });
}
function createDot(targetId, title) {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    dot.onclick = () => { document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' }); };
    navDotsContainer.appendChild(dot);
    dot.dataset.target = targetId;
}
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelector('.reveal')?.classList.add('visible');
                document.querySelectorAll('.nav-dot').forEach(d => d.classList.toggle('active', d.dataset.target === entry.target.id));
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('section').forEach(s => observer.observe(s));
}
init();"""
    with open(os.path.join(path, 'script.js'), 'w') as f: f.write(js_content)

# 执行生成 (跳过 L1 因为 L1 是深度定制的)
for i, (f, s) in enumerate(g3_data[1:]):
    generate_lesson('Grade3_JuniorMaker', f, s, i+1)
for i, (f, s) in enumerate(g8_data[1:]):
    generate_lesson('Grade8_FutureDesigner', f, s, i+1)

print("颗粒化重构完成！")
