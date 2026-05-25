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
    // Layer Mechanics Demo
    const btnForceStand = document.getElementById('btn-force-stand');
    const btnForceLay = document.getElementById('btn-force-lay');
    const clipStand = document.getElementById('clip-stand');
    const clipLay = document.getElementById('clip-lay');
    const lMsg = document.getElementById('l-msg');

    if(btnForceStand && btnForceLay) {
        btnForceStand.addEventListener('click', () => {
            clipStand.classList.add('is-force');
            clipLay.classList.remove('is-force');
            lMsg.innerHTML = '<strong style="color:#e74c3c">灾难：层纹劈裂！</strong> 站立打印的夹子，受力方向与层纹平行。胶水承受不住拉力，直接断成两截！';
        });

        btnForceLay.addEventListener('click', () => {
            clipLay.classList.add('is-force');
            clipStand.classList.remove('is-force');
            lMsg.innerHTML = '<strong style="color:#2ecc71">坚不可摧！</strong> 侧躺打印的夹子，受力方向与层纹垂直。连续的塑料长丝贯穿受力点，极具韧性！';
        });
    }
});
