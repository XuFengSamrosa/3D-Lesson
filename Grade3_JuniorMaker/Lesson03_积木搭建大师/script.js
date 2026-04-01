const lessonData = ['乐高挑战：搭建城堡', '方块与圆柱：好朋友', '对齐数字设计：站稳了吗？', '空间大冒险：旋转视角'];

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
init();