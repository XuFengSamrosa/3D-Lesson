document.addEventListener("DOMContentLoaded", () => {
    // 监听科幻版块进入视口以触发 CSS 动效
    const sections = document.querySelectorAll('.cyber-section');
    const navDiamonds = document.querySelectorAll('.nav-diamond');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 骇入！添加激活状态的 class
                entry.target.classList.add('is-visible');
                
                // 同步更新右侧菱形小基站的高亮状态
                const targetId = entry.target.getAttribute('id');
                navDiamonds.forEach(diamond => {
                    diamond.classList.remove('active');
                    if(diamond.getAttribute('data-target') === targetId) {
                        diamond.classList.add('active');
                    }
                });
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.25 // 进入视口 25% 时激活
    });

    sections.forEach(sec => observer.observe(sec));

    // 为导航点绑定点击平滑跃迁操作
    navDiamonds.forEach(diamond => {
        diamond.addEventListener('click', () => {
            const targetId = diamond.getAttribute('data-target');
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        });
    });
});
