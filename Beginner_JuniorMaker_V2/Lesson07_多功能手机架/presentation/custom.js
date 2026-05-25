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
    // Gravity Demo
    const btnGravity = document.getElementById('btn-gravity');
    const gStand = document.getElementById('g-stand');

    if(btnGravity && gStand) {
        btnGravity.addEventListener('click', () => {
            gStand.classList.toggle('fail');
            if(gStand.classList.contains('fail')) {
                btnGravity.textContent = '🔄 撤销 (拿走手机)';
                btnGravity.style.background = '#34495e';
            } else {
                btnGravity.textContent = '测试重心 (放上手机)';
                btnGravity.style.background = '#e74c3c';
            }
        });
    }

    // Lay Flat Demo
    const btnFlat = document.getElementById('btn-flat');
    const lModel = document.getElementById('l-model');
    const lVisual = document.querySelector('.l-visual');

    if(btnFlat && lModel) {
        btnFlat.addEventListener('click', () => {
            lModel.classList.toggle('is-flat');
            lVisual.classList.toggle('is-flat');
            
            if(lModel.classList.contains('is-flat')) {
                btnFlat.textContent = '🔄 撤销 (回到悬空状态)';
                btnFlat.style.background = '#95a5a6';
            } else {
                btnFlat.textContent = 'F 键：强制熨平鞋底';
                btnFlat.style.background = '#3498db';
            }
        });
    }
});
