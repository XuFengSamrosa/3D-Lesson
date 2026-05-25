document.addEventListener('DOMContentLoaded', () => {
    const stepBtns = document.querySelectorAll('.step-btn');
    const descriptions = document.querySelectorAll('.desc');
    const visualSide = document.querySelector('.visual-side');
    const scene = document.querySelector('.scene');
    
    let autoRotate = true;
    let angle = 45;

    function rotateScene() {
        if(autoRotate && scene) {
            angle += 0.5;
            let rotX = -20;
            // Check if there is a specific tilt defined by the active step
            if(visualSide) {
                const activeClasses = Array.from(visualSide.classList);
                activeClasses.forEach(c => {
                    if(c.startsWith('tilt-')) rotX = parseInt(c.replace('tilt-', ''));
                });
            }
            scene.style.transform = `rotateX(${rotX}deg) rotateY(${angle}deg)`;
        }
        requestAnimationFrame(rotateScene);
    }
    if(scene) rotateScene();

    if(visualSide) {
        visualSide.addEventListener('mouseenter', () => autoRotate = false);
        visualSide.addEventListener('mouseleave', () => autoRotate = true);
    }

    stepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const step = btn.getAttribute('data-step');
            
            stepBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            descriptions.forEach(d => d.classList.remove('show'));
            const targetDesc = document.getElementById(`desc-${step}`);
            if(targetDesc) targetDesc.classList.add('show');

            if(visualSide) {
                // Clear old step classes
                visualSide.className = 'visual-side'; 
                if (step > 0) {
                    visualSide.classList.add(`step-${step}`);
                    // Trigger reflow to restart animations if any
                    void visualSide.offsetWidth; 
                }
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // Current Date for Protocol Paper
    const dateSpan = document.getElementById('current-date');
    if(dateSpan) {
        const today = new Date();
        dateSpan.textContent = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    }

    // Assembly Demo
    const btnAssemble = document.getElementById('btn-assemble');
    const ecoDemo = document.querySelector('.eco-demo');
    if(btnAssemble && ecoDemo) {
        btnAssemble.addEventListener('click', () => {
            ecoDemo.classList.toggle('is-assembled');
            if(ecoDemo.classList.contains('is-assembled')) {
                btnAssemble.textContent = '📦 拆分模块 (各自研发)';
                btnAssemble.style.background = '#e74c3c';
            } else {
                btnAssemble.textContent = '🚀 启动航母：模块化组装！';
                btnAssemble.style.background = '#3498db';
            }
        });
    }

    // Protocol Signature
    const btnSign = document.getElementById('btn-sign');
    const signatures = document.getElementById('signatures');
    if(btnSign && signatures) {
        btnSign.addEventListener('click', () => {
            btnSign.style.display = 'none';
            signatures.classList.add('show');
        });
    }
});
