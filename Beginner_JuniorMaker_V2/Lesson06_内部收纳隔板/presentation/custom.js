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
    // Array Demo
    const btnArray = document.getElementById('btn-array');
    const cStack = document.getElementById('c-stack');

    if(btnArray && cStack) {
        btnArray.addEventListener('click', () => {
            cStack.classList.toggle('is-arrayed');
            if(cStack.classList.contains('is-arrayed')) {
                btnArray.textContent = '🔄 撤销 (回到原位重叠)';
                btnArray.style.background = '#e74c3c';
            } else {
                btnArray.textContent = '执行：粘一次，拽一下';
                btnArray.style.background = '#f39c12';
            }
        });
    }

    // Support Demo
    const btnSupport = document.getElementById('btn-support');
    const sVisual = document.getElementById('s-visual');

    if(btnSupport && sVisual) {
        btnSupport.addEventListener('click', () => {
            sVisual.classList.toggle('is-supported');
            if(sVisual.classList.contains('is-supported')) {
                btnSupport.textContent = '✨ 魔法完成！脚手架已生成';
                btnSupport.style.background = '#34495e';
            } else {
                btnSupport.textContent = '施法：长出支撑脚手架！';
                btnSupport.style.background = '#27ae60';
            }
        });
    }
});
