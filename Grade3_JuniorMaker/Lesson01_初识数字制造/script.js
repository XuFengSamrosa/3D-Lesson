document.addEventListener("DOMContentLoaded", () => {
    // 1. 注册滚动进场动画 (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4 // 元素进入视口 40% 时触发动画绑定
    };

    const sections = document.querySelectorAll('.scroll-section');
    const navDots = document.querySelectorAll('.nav-dot');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 进入视口添加动画触发类
                entry.target.classList.add('is-visible');
                
                // 同步更新右侧导航点状态
                const targetId = entry.target.getAttribute('id');
                navDots.forEach(dot => {
                    dot.classList.remove('active');
                    if(dot.getAttribute('data-target') === targetId) {
                        dot.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => {
        observer.observe(sec);
    });

    // 2. 右侧导航点点击跳转 (Smooth Scroll)
    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetId = dot.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if(targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 3. 增强键盘控制体验 (上下键或空格键滚动至下一个 section)
    // 原生行为已支持滚动，这里若做 Fullpage 跳转可能会带来滚动劫持，
    // 因此保留浏览器的 default 行为，即可保持最佳流畅度！
});
