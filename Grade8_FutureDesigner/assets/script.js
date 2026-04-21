document.addEventListener('DOMContentLoaded', () => {
    const navDotsContainer = document.getElementById('nav-dots');
    const sections = document.querySelectorAll('section');

    function createDot(targetId, title) {
        if(!navDotsContainer) return;
        const dot = document.createElement('button');
        dot.className = 'nav-dot';
        dot.title = title;
        dot.dataset.target = targetId;
        dot.onclick = () => {
            const targetEl = document.getElementById(targetId);
            if(targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
        };
        navDotsContainer.appendChild(dot);
    }

    // Auto-generate dots for every section
    sections.forEach((section, index) => {
        const titleEl = section.querySelector('h1, h2');
        const title = titleEl ? titleEl.innerText : `Slide ${index+1}`;
        createDot(section.id || `section-${index}`, title);
        if(!section.id) section.id = `section-${index}`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to all .reveal elements in the section
                const reveals = entry.target.querySelectorAll('.reveal');
                reveals.forEach(r => r.classList.add('visible'));

                // Update nav dots
                if(navDotsContainer) {
                    document.querySelectorAll('.nav-dot').forEach(dot => {
                        dot.classList.toggle('active', dot.dataset.target === entry.target.id);
                    });
                }
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => {
        observer.observe(section);
    });
});
