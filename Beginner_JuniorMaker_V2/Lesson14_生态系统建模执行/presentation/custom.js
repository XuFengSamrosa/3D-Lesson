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
    // Merge Demo (Add vs Double Click)
    const btnAdd = document.getElementById('btn-add');
    const btnDouble = document.getElementById('btn-double');
    const workspace = document.getElementById('workspace');
    const alertBox = document.getElementById('alert-box');

    if(btnAdd && btnDouble && workspace) {
        btnAdd.addEventListener('click', () => {
            alertBox.classList.remove('show');
            workspace.classList.add('added');
            btnAdd.textContent = '✅ 添加成功';
            setTimeout(() => { btnAdd.textContent = '➕ 添加模型'; }, 2000);
        });

        btnDouble.addEventListener('click', () => {
            workspace.classList.remove('added');
            alertBox.classList.add('show');
        });
    }

    // X-Ray Toggle
    const modeNormal = document.getElementById('mode-normal');
    const modeXray = document.getElementById('mode-xray');
    const xrayViewport = document.getElementById('xray-viewport');

    if(modeNormal && modeXray && xrayViewport) {
        modeNormal.addEventListener('change', () => {
            if(modeNormal.checked) {
                xrayViewport.classList.remove('is-xray');
            }
        });

        modeXray.addEventListener('change', () => {
            if(modeXray.checked) {
                xrayViewport.classList.add('is-xray');
            }
        });
    }
});
