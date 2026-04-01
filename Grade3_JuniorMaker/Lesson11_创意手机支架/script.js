const lessonData = ['手机的指挥椅', '斜面画图：寻找最佳角度', '稳固支撑：底部加重设计', '个性造型：动物形支架'];

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