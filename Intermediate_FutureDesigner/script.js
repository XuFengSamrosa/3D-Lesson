const grade8Data = [
    { 
        title: "增材制造与工业4.0", 
        tag: "LESSON 01 // OVERVIEW", 
        slides: [
            { 
                type: "hero", 
                text: "THE FUTURE OF MANUFACTURING", 
                desc: "从底层逻辑出发，重新定义制造流程。" 
            },
            { 
                type: "timeline", 
                text: "技术演进轨迹", 
                events: [
                    { year: "1980s", event: "SLA 光固化问世" },
                    { year: "1990s", event: "FDM 熔融沉积专利申请" },
                    { year: "2010s", event: "开源项目推动普及" },
                    { year: "2020s", event: "高速/智能/AI 集成 (A1 系列)" }
                ] 
            },
            { 
                type: "slicing", 
                text: "工业切片逻辑: Bambu Studio", 
                params: ["层高 (0.20mm) - 精度权衡", "填充 (15%) - 强重比优化", "外壁 (2 Loops) - 表面刚性", "支撑 (Auto) - 垂向受力"] 
            },
            { 
                type: "hardware", 
                text: "A1 核心组件解构", 
                components: ["⚡ 钛合金喉管 (隔热)", "🌀 共振传感器 (动态校准)", "🎛️ 主板单元 (逻辑中心)", "💡 LED 监测 (视觉状态)"] 
            }
        ] 
    },
    { title: "精确建模：约束之力", tag: "LESSON 02 // PRECISION", slides: ["GEOMETRIC CONSTRAINTS", "DIMENSIONING & CONSTANTS", "PARAMETRIC DESIGN FLOW", "STEP vs STL PROTOCOL"] },
    { title: "AI 辅助创意构思", tag: "LESSON 03 // AI COLLAB", slides: ["GENERATIVE AI IDEATION", "EXTRACTING FORM FROM SKETCH", "SPLINE & CURVE MASTERING", "HUMAN-AI WORKFLOW"] },
    { title: "机械铰链与免组装", tag: "LESSON 04 // MECHANICS", slides: ["HINGE & JOINT DYNAMICS", "TOLERANCE & GAP CONTROL", "PRINT-IN-PLACE STRUCTURE", "ITERATIVE OPTIMIZATION"] },
    { title: "人体工程学设计", tag: "LESSON 05 // ERGONOMIC", slides: ["CURVED SURFACE MODELING", "LOFTING THROUGH CROSS SECTIONS", "TANGENT CONTROL", "USER INTERFACE COMFORT"] },
    { title: "建筑结构挑战", tag: "LESSON 06 // STRUCTURE", slides: ["TRUSS BRIDGE ENGINEERING", "LOAD-BEARING ANALYSIS", "REDUNDANCY IN DESIGN", "STRENGTH vs WEIGHT RATIO"] },
    { title: "AI 参数化纹理", tag: "LESSON 07 // PARAMETRIC", slides: ["AI-DRIVEN TEXTURE GEN", "VORONOI & TURING PATTERNS", "SURFACE PROJECTION MAPPING", "HIGH-POLY SLICING STRATEGY"] },
    { title: "极简主义花瓶", tag: "LESSON 08 // AESTHETICS", slides: ["SWEEPING ALONG 3D PATHS", "SHELL TOOL FOR UNIFORM WALLS", "STREAMLINED INDUSTRIAL FORM", "VAS MODE (SPIRAL) PRINTING"] },
    { title: "逆向设计应用", tag: "LESSON 09 // REVERSE ENG", slides: ["FIT-TO-REAL PRECISION", "OFFSET & CLEARANCE CALCULATIONS", "REVERSE MODELING FROM SCANS", "ADAPTIVE CASE DESIGN"] },
    { title: "齿轮传动机构", tag: "LESSON 10 // KINETIC", slides: ["GEAR RATIO & MODULUS", "MESHING GAP TOLERANCE", "TRANSMISSION EFFICIENCY", "3D PRINTED FRICTION CONTROL"] },
    { title: "AMS 多色色彩策略", tag: "LESSON 11 // MULTI-COLOR", slides: ["AI-ASSISTED COLOR GRADING", "BODY-BASED COLOR ASSIGNMENT", "FLUSH VOLUME OPTIMIZATION", "MULTI-BODY EXPORT LOGIC"] },
    { title: "仿生轻量化结构", tag: "LESSON 12 // BIONIC", slides: ["HONEYCOMB & LATTICE INFILL", "STRUCTURAL OPTIMIZATION", "BIO-MIMICRY IN ENGINEERING", "MATERIAL SAVING STRATEGY"] },
    { title: "智能硬件外壳开发", tag: "LESSON 13 // HARDWARE I", slides: ["INTERNAL COMPONENT LAYOUT", "HEAT DISSIPATION CHANNELS", "SCREW HOLE & SNAP FIT", "ITERATIVE PROTOTYPING"] },
    { title: "外壳细节优化", tag: "LESSON 14 // HARDWARE II", slides: ["BUTTON TACTILE FEEDBACK", "CABLE MANAGEMENT SLOTS", "USER EXPERIENCE REFINEMENT", "FINAL ASSEMBLY VALIDATION"] },
    { title: "未来城市单体设计", tag: "LESSON 15 // PROJECT I", slides: ["FUTURISTIC ARCHITECTURE", "SYSTEM INTEGRATION DESIGN", "SCALING & PROPORTION", "MODULAR URBAN PLANNING"] },
    { title: "综合项目路演", tag: "LESSON 16 // PROJECT II", slides: ["DESIGN LOGIC PRESENTATION", "TECHNICAL CHALLENGE SOLVING", "PEER REVIEW & FEEDBACK", "THE FUTURE OF CREATION"] }
];

const lessonContainer = document.getElementById('lesson-sections');
const navDotsContainer = document.getElementById('nav-dots');

function init() {
    renderContent();
    setupIntersectionObserver();
}

function renderContent() {
    createDot('hero', 'OVERVIEW // 概览');

    grade8Data.forEach((lesson, lIdx) => {
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
                            <h1 class="main-title">${slide.text}</h1>
                            <p class="subtitle">${slide.desc}</p>
                        </div>`;
                } else if (slide.type === "timeline") {
                    htmlContent = `
                        <div class="reveal card-timeline">
                            <div class="tag">EVOLUTION</div>
                            <h2>${slide.text}</h2>
                            <div class="timeline-container">
                                ${slide.events.map(e => `
                                    <div class="timeline-node">
                                        <div class="year">${e.year}</div>
                                        <div class="event">${e.event}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>`;
                } else if (slide.type === "slicing") {
                    htmlContent = `
                        <div class="reveal card-slicing">
                            <div class="tag">SLICING DATA</div>
                            <h2>${slide.text}</h2>
                            <div class="params-grid">
                                ${slide.params.map(p => `<div class="param">${p}</div>`).join('')}
                            </div>
                        </div>`;
                } else if (slide.type === "hardware") {
                    htmlContent = `
                        <div class="reveal card-hardware">
                            <div class="tag">HARDWARE SPEC</div>
                            <h2>${slide.text}</h2>
                            <div class="comp-list">
                                ${slide.components.map(c => `<div class="comp">${c}</div>`).join('')}
                            </div>
                        </div>`;
                }
            } else {
                // 其他课时标准渲染
                htmlContent = `
                    <div class="reveal">
                        ${sIdx === 0 ? `<div class="tag">${lesson.tag}</div>` : ''}
                        <h2>${slide}</h2>
                        <p class="subtitle">${(lIdx+1).toString().padStart(2, '0')} // ${lesson.title.toUpperCase()}</p>
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
    const options = { threshold: 0.3 };
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
