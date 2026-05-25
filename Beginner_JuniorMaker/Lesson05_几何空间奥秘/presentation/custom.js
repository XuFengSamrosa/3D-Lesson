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
    // Cut Demo Logic
    const btnCut = document.getElementById('btn-cut');
    const btnReset = document.getElementById('btn-reset');
    const cutViewport = document.getElementById('cut-viewport');

    if(btnCut && btnReset && cutViewport) {
        btnCut.addEventListener('click', () => {
            cutViewport.classList.add('is-cut');
        });

        btnReset.addEventListener('click', () => {
            cutViewport.classList.remove('is-cut');
        });
    }

    // Dowel Assemble Logic
    const btnAssemble = document.getElementById('btn-assemble');
    const dowelViewport = document.querySelector('.dowel-viewport');

    if(btnAssemble && dowelViewport) {
        btnAssemble.addEventListener('click', () => {
            dowelViewport.classList.toggle('is-assembled');
            if(dowelViewport.classList.contains('is-assembled')) {
                btnAssemble.textContent = '🧩 拆分开来看看内部孔位';
            } else {
                btnAssemble.textContent = '🔧 销钉拼装演示';
            }
        });
    }
});
