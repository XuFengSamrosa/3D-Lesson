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
    // Alignment Demo
    const btnAlign = document.getElementById('btn-align');
    const cVisual = document.querySelector('.c-visual');

    if(btnAlign && cVisual) {
        btnAlign.addEventListener('click', () => {
            cVisual.classList.toggle('is-aligned');
            if(cVisual.classList.contains('is-aligned')) {
                btnAlign.textContent = '🔄 撤销 (鼠标瞎拖状态)';
                btnAlign.style.background = '#e74c3c';
            } else {
                btnAlign.textContent = '锁定中心 (X:128 Y:128)';
                btnAlign.style.background = '#3498db';
            }
        });
    }

    // Physics Demo
    const btnBad = document.getElementById('btn-bad');
    const btnGood = document.getElementById('btn-good');
    const spinModel = document.getElementById('spin-model');
    const physMsg = document.getElementById('phys-msg');

    if(btnBad && btnGood && spinModel) {
        btnBad.addEventListener('click', () => {
            spinModel.classList.add('is-bad');
            physMsg.innerHTML = '<strong style="color:#e74c3c">灾难发生！</strong> X 轴偏差导致严重偏心，高速旋转的离心力瞬间把陀螺拉倒了！';
        });

        btnGood.addEventListener('click', () => {
            spinModel.classList.remove('is-bad');
            physMsg.innerHTML = '<strong style="color:#2ecc71">完美平衡！</strong> 四个配重块的距离绝对相等，陀螺可以平稳地转上几分钟！';
        });
    }
});
