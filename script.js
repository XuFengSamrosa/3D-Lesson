const lessonData = {
    g3: [
        { title: "魔法打印机初探", slides: ["欢迎来到3D魔法世界！", "认识你的新伙伴：拓竹A1", "安全第一：热端高温警告", "见证魔法：第一次打印"] },
        { title: "我的名字徽章", slides: ["创意第一步：写下你的名字", "Shapr3D：像捏橡皮泥一样建模", "拉伸魔法：让文字立起来", "切片预览：看看机器怎么想"] },
        { title: "积木搭建大师", slides: ["城堡挑战：搭建大门", "几何拼图：方块与圆柱", "空间漫游：上下左右对齐", "稳如泰山：结构平衡测试"] },
        { title: "几何动物园", slides: ["布尔魔术：挖洞与融合", "制作一只小猪：圆圆的身体", "耳朵大冒险：减法运算", "多彩世界：AMS变色初探"] }
    ],
    g8: [
        { title: "工业4.0与拓竹A1", slides: ["改写制造史：增材制造", "极速体验：A1的核心黑科技", "Bambu Studio：工程师的利刃", "填充率与强度的奥秘"] },
        { title: "精确建模：工业零件", slides: ["分毫不差：约束的力量", "草图约束：从圆到螺盖", "标注与参数化：随心而动", "Step vs STL：格式的抉择"] },
        { title: "AI辅助创意构思", slides: ["AI脑暴：寻找设计灵感", "提取灵魂：从草图到3D", "样条曲线：优雅的曲面之美", "人机协作：设计的未来"] },
        { title: "机械铰链与免组装", slides: ["会动的模型：铰链设计", "关键控制：公差与间隙", "一站式打印：无需组装", "机械结构的逻辑美"] }
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
