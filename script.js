const lessonData = {
    g3: [
        { title: "魔法打印机初探", slides: ["欢迎来到3D魔法世界！", "认识你的新伙伴：拓竹A1", "安全第一：热端高温警告", "见证魔法：第一次打印"] },
        { title: "我的名字徽章", slides: ["创意第一步：写下你的名字", "Shapr3D：像捏橡皮泥一样建模", "拉伸魔法：让文字立起来", "切片预览：看看机器怎么想"] },
        { title: "积木搭建大师", slides: ["城堡挑战：搭建大门", "几何拼图：方块与圆柱", "空间漫游：上下左右对齐", "稳如泰山：结构平衡测试"] },
        { title: "几何动物园", slides: ["布尔魔术：挖洞与融合", "制作一只小猪：圆圆的身体", "耳朵大冒险：减法运算", "多彩世界：AMS变色初探"] }
    ],
    g8: [
        { title: "增材制造与工业4.0", slides: ["工业革命的新纪元", "核心突破：拓竹A1黑科技", "切片逻辑原理推演", "填充结构的物理学分析"] },
        { title: "精密建模与数字徽章", slides: ["精准设计的参数化基石", "草图约束下的空间拓扑", "拉伸特征与工程尺寸", "切片软件深度换色"] },
        { title: "复杂装配与模块逻辑", slides: ["模块化工程的核心概念", "高阶：XYZ轴矩阵定位", "数字底盘堆叠方案", "重心稳固与结构验证"] },
        { title: "参数化几何与布尔运算", slides: ["计算机几何布尔算法", "实体切割：精准挖洞", "拓扑融合：加法重构", "阵列逻辑在模型上的应用"] },
        { title: "空间拓扑与莫比乌斯环", slides: ["拓扑学中的空间扭曲", "生成逻辑：放样与扫掠", "高阶几何：制作曲面", "路径生成的美学控制"] },
        { title: "阵列偏移与工业收纳", slides: ["标准化外壳与精准输入", "内部空腔与厚度计算", "阵列分布的算法思维", "实用的模块化零件箱"] },
        { title: "路径阵列与模块系统", slides: ["规模化设计的捷径", "非线性阵列复制公式", "工程倒角与结构减重", "悬垂角度与极限支撑"] },
        { title: "物理模拟与动态零件", slides: ["质心与力学平衡探讨", "回转建构：对称工具", "转动惯量的核心变量", "打印方向与层间撕裂"] },
        { title: "复杂纹理与光影工程", slides: ["数字化切削与仿生镂空", "布尔差集实现几何重构", "薄壁打印的设计参数", "多边形减面与切片"] },
        { title: "机械联动与可动结构", slides: ["一站式打印的结构魅力", "球头关节与万向轴", "公差验证与打印容错", "免组装验证挑战"] },
        { title: "机械公差与斜面建模", slides: ["复杂重力中心建模", "斜平面的精淮截取", "配重与底盘加固方案", "承重的支撑点设计"] },
        { title: "逆向工程与适配系统", slides: ["工业实测与逆向卡扣", "游标卡尺测绘转化", "无缝卡卡扣槽预留", "从物理数据到数字重建"] },
        { title: "未来都市：系统规划", slides: ["超大规模系统工程初步", "全班协同：标准协议制定", "比例尺换算规范", "底层网格与道路编排"] },
        { title: "未来都市：集成建模", slides: ["从组件库到宏观规划", "模块化拼装核心节点", "几何群组对齐方案", "误差分析与修正"] },
        { title: "未来都市：生产工程", slides: ["大规模生产规划算法", "排版大师：耗材效率优化", "批量支撑剥离演练", "组件装配测试流程"] },
        { title: "未来都市：成果演示", slides: ["工程联调与架构审查", "数字蓝图与实体成果", "工业设计复盘总结", "未来造物主启航"] }
    ]
};

let currentGrade = 'g3';
let currentLessonIdx = 0;
let currentSlideIdx = 0;

const sidebarList = document.getElementById('lesson-list');
const slideViewport = document.getElementById('slides-viewport');
const indicator = document.getElementById('slide-indicator');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const gradeBtns = document.querySelectorAll('.btn-grade');

// 初始化
function init() {
    renderLessonList();
    renderSlide();
    bindEvents();
}

// 渲染课时列表
function renderLessonList() {
    sidebarList.innerHTML = '';
    lessonData[currentGrade].forEach((lesson, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${lesson.title}`;
        if (index === currentLessonIdx) li.classList.add('active');
        li.onclick = () => selectLesson(index);
        sidebarList.appendChild(li);
    });
}

// 渲染幻灯片
function renderSlide() {
    const lesson = lessonData[currentGrade][currentLessonIdx];
    const slides = lesson.slides;
    
    slideViewport.innerHTML = `
        <div class="slide active">
            <div class="content">
                <span class="lesson-tag">第 ${currentLessonIdx + 1} 课</span>
                <h1 class="animate-text">${slides[currentSlideIdx]}</h1>
                <p class="subtitle">${lesson.title} - 关键知识点</p>
                <div class="visual-placeholder">
                    <div class="cube-animation"></div>
                </div>
            </div>
        </div>
    `;
    
    indicator.textContent = `${currentSlideIdx + 1} / ${slides.length}`;
}

// 选择课时
function selectLesson(index) {
    currentLessonIdx = index;
    currentSlideIdx = 0;
    renderLessonList();
    renderSlide();
}

// 下一张
function nextSlide() {
    const slides = lessonData[currentGrade][currentLessonIdx].slides;
    if (currentSlideIdx < slides.length - 1) {
        currentSlideIdx++;
        renderSlide();
    } else if (currentLessonIdx < lessonData[currentGrade].length - 1) {
        currentLessonIdx++;
        currentSlideIdx = 0;
        renderLessonList();
        renderSlide();
    }
}

// 上一张
function prevSlide() {
    if (currentSlideIdx > 0) {
        currentSlideIdx--;
        renderSlide();
    } else if (currentLessonIdx > 0) {
        currentLessonIdx--;
        currentSlideIdx = lessonData[currentGrade][currentLessonIdx].slides.length - 1;
        renderLessonList();
        renderSlide();
    }
}

// 绑定事件
function bindEvents() {
    nextBtn.onclick = nextSlide;
    prevBtn.onclick = prevSlide;
    
    gradeBtns.forEach(btn => {
        btn.onclick = () => {
            currentGrade = btn.dataset.grade;
            currentLessonIdx = 0;
            currentSlideIdx = 0;
            gradeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderLessonList();
            renderSlide();
        };
    });

    document.onkeydown = (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    };
}

init();
