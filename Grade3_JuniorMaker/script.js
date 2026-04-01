const grade3Data = [
    { 
        title: "魔法打印机初探", 
        tag: "第 1 课", 
        slides: [
            { 
                type: "hero", 
                text: "欢迎来到魔法工坊！", 
                desc: "在这里，我们要把你的脑洞变成现实。" 
            },
            { 
                type: "safety", 
                text: "魔法师的安全守则", 
                items: ["🚫 不要摸喷头 (220℃)", "🧊 别碰移动小车", "💂 安全观察距离", "🔒 老师不在不操作"] 
            },
            { 
                type: "software", 
                text: "进入魔法之境: Shapr3D", 
                steps: ["点击左上角 [ + ]", "选择底部视图 [ Top ]", "工具箱找到 [ Sketch ]", "画一个 [ Rectangle ]"] 
            },
            { 
                type: "printer", 
                text: "认识魔法盒: 拓竹 A1", 
                parts: ["✨ 喷头 (魔法源)", "🏗️ 导轨 (魔法轨道)", "🎨 线材 (彩色流)"] 
            }
        ] 
    },
    { title: "我的名字徽章", tag: "第 2 课", slides: ["我们要有自己的徽章！", "写下名字：变高魔法", "Shapr3D：捏捏看", "切片秘密：糖果色打印"] },
    { title: "积木搭建大师", tag: "第 3 课", slides: ["乐高挑战：搭建城堡", "方块与圆柱：好朋友", "对齐魔法：站稳了吗？", "空间大冒险：旋转视角"] },
    { title: "几何动物园", tag: "第 4 课", slides: ["变个魔术：抠洞洞", "小耳朵猪：怎么变？", "布尔运算：加法与减法", "多彩世界：小猪穿彩衣"] },
    { title: "神奇的莫比乌斯环", tag: "第 5 课", slides: ["无尽空间：神奇纸带", "扭转魔法：一个面的世界", "路径扫描：丝滑成型", "数学之美：莫比乌斯环"] },
    { title: "桌面小管家", tag: "第 6 课", slides: ["给文具找个家", "精确输入：量量你的橡皮", "偏移技巧：制作空盒子", "功能装饰：专属名字刻印"] },
    { title: "迷你景观配件", tag: "第 7 课", slides: ["多肉植物的小邻居", "路径阵列：整齐的栅栏", "指路牌设计：文字投影", "支撑探秘：给模型穿马甲"] },
    { title: "旋转陀螺大赛", tag: "第 8 课", slides: ["寻找重心：为什么会转？", "回转工具：一圈变主体", "平衡设计：两边要一样重", "极速竞技：谁转得最久"] },
    { title: "镂空灯罩设计", tag: "第 9 课", slides: ["光影魔术师", "环形阵列：对称的花纹", "布尔减法：剪纸特效", "温馨时刻：透光效果展示"] },
    { title: "关节可动小人", tag: "第 10 课", slides: ["动起来：模仿你的关节", "球头结构：灵活的转动", "公差预留：不要粘在一起", "免组装挑战：打印即活动"] },
    { title: "创意手机支架", tag: "第 11 课", slides: ["手机的指挥椅", "斜面画图：寻找最佳角度", "稳固支撑：底部加重设计", "个性造型：动物形支架"] },
    { title: "拓竹A1大变身", tag: "第 12 课", slides: ["我是打印机小管家", "卡扣结构：精准的U型槽", "实用小工具：刮刀架设计", "色彩点缀：多色附件制作"] },
    { title: "梦想社区规划", tag: "第 13 课", slides: ["我们都是城市规划师", "团队分工：各司其职", "比例统一：大家的比例尺", "蓝图绘制：社区的主题"] },
    { title: "梦想社区建模", tag: "第 14 课", slides: ["建造我们的小房子", "细节打磨：路灯与喷泉", "组件合并：大家的作品", "精益求精：修整模型边缘"] },
    { title: "打印与组装", tag: "第 15 课", slides: ["大规模生产：摆满打印板", "切片大师：节省线材技巧", "清理工作：去掉支撑的部分", "初步合体：各小组作品汇总"] },
    { title: "作品发布会", tag: "第 16 课", slides: ["小小市长点亮城市", "设计分享：我的闪光点", "团队之星：我们的协作故事", "魔法结业：首席架构师奖"] }
];

const lessonContainer = document.getElementById('lesson-sections');
const navDotsContainer = document.getElementById('nav-dots');

function init() {
    renderContent();
    setupIntersectionObserver();
}

function renderContent() {
    createDot('intro', '首页');

    grade3Data.forEach((lesson, lIdx) => {
        lesson.slides.forEach((slide, sIdx) => {
            const sectionId = `slide-${lIdx}-${sIdx}`;
            const section = document.createElement('section');
            section.id = sectionId;

            let htmlContent = "";
            
            // 针对第 1 课的特别渲染逻辑
            if (lIdx === 0) {
                if (slide.type === "hero") {
                    htmlContent = `
                        <div class="reveal card-hero">
                            <span class="emoji-float">✨</span>
                            <h2>${slide.text}</h2>
                            <p class="subtitle">${slide.desc}</p>
                        </div>`;
                } else if (slide.type === "safety") {
                    htmlContent = `
                        <div class="reveal card-safety">
                            <div class="tag red">安全第一</div>
                            <h2>${slide.text}</h2>
                            <div class="safety-grid">
                                ${slide.items.map(i => `<div class="safety-item">${i}</div>`).join('')}
                            </div>
                        </div>`;
                } else if (slide.type === "software") {
                    htmlContent = `
                        <div class="reveal card-software">
                            <div class="tag">软件指南</div>
                            <h2>${slide.text}</h2>
                            <div class="step-guide">
                                ${slide.steps.map((s, i) => `<div class="step"><span>${i+1}</span> ${s}</div>`).join('')}
                            </div>
                        </div>`;
                } else if (slide.type === "printer") {
                    htmlContent = `
                        <div class="reveal card-printer">
                            <div class="tag blue">硬件揭秘</div>
                            <h2>${slide.text}</h2>
                            <div class="parts-list">
                                ${slide.parts.map(p => `<div class="part">${p}</div>`).join('')}
                            </div>
                        </div>`;
                }
            } else {
                // 其他课时的标准渲染
                htmlContent = `
                    <div class="reveal">
                        ${sIdx === 0 ? `<div class="tag">${lesson.tag}</div>` : ''}
                        <h2>${slide}</h2>
                        <p class="subtitle">${lesson.title} - 知识点 ${sIdx + 1}</p>
                    </div>`;
            }

            section.innerHTML = htmlContent;
            lessonContainer.appendChild(section);
            createDot(sectionId, `${lesson.title} - ${sIdx + 1}`);
        });
    });
}

function createDot(targetId, title) {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    dot.title = title;
    dot.onclick = () => {
        document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
    };
    navDotsContainer.appendChild(dot);
    dot.dataset.target = targetId;
}

function setupIntersectionObserver() {
    const options = { threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelector('.reveal')?.classList.add('visible');
                updateActiveDot(entry.target.id);
            }
        });
    }, options);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

function updateActiveDot(activeId) {
    document.querySelectorAll('.nav-dot').forEach(dot => {
        dot.classList.toggle('active', dot.dataset.target === activeId);
    });
}

init();
