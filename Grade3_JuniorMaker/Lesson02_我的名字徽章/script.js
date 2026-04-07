document.addEventListener("DOMContentLoaded", () => {
    // 1. 设置点导航点击事件
    const lessonData = ["我们要有自己的徽章！", "数字画布：制作卡片", "阴阳魔法：镂空与凸起", "骨架探秘：5%、50%填充", "切片见证：神奇的内部"];
    const navDots = document.querySelectorAll('.nav-dot');
    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetId = dot.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 2. 设置滚动监听 (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 给当前出现的 section 加上 visible
                entry.target.classList.add('visible');
                
                // 更新右侧导航小圆点的高亮状态
                navDots.forEach(d => {
                    if (d.getAttribute('data-target') === entry.target.id) {
                        d.classList.add('active');
                    } else {
                        d.classList.remove('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    // 监听所有的 section
    document.querySelectorAll('section.scroll-section').forEach(section => {
        observer.observe(section);
    });
});