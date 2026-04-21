/**
 * Junior Maker Premium - Global Interactivity
 * Focus: Scroll Snapping, Intersection Effects, Auto Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    initPremiumSlides();
});

function initPremiumSlides() {
    const sections = document.querySelectorAll('section.scroll-section');
    const viewport = document.getElementById('slide-viewport');
    
    // 1. 生成导航锚点 (如果页面已有 .side-nav 结构)
    const navUl = document.querySelector('.side-nav ul');
    if (navUl && sections.length > 0) {
        // 先清空占位
        navUl.innerHTML = '';
        sections.forEach(section => {
            const id = section.id || `section-${Math.random().toString(36).substr(2, 9)}`;
            section.id = id;
            
            const li = document.createElement('li');
            const dot = document.createElement('button');
            dot.className = 'nav-dot';
            dot.dataset.target = id;
            dot.title = section.querySelector('.big-header')?.innerText || id;
            
            dot.addEventListener('click', () => {
                section.scrollIntoView({ behavior: 'smooth' });
            });
            
            li.appendChild(dot);
            navUl.appendChild(li);
        });
    }

    // 2. Intersection Observer 处理动画效果
    const observerOptions = {
        root: viewport || null,
        threshold: 0.5 // 当 50% 的区域进入视野时触发
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 添加可见类
                entry.target.classList.add('visible');
                
                // 更新导航点状态
                updateActiveDot(entry.target.id);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

function updateActiveDot(activeId) {
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach(dot => {
        if (dot.dataset.target === activeId) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// 辅助功能：给所有含 delay 类别的元素自动增加延迟
// 可以在 CSS 中预设，也可以在此动态注入（目前已在 CSS 中预设了 delay-1/2/3）
