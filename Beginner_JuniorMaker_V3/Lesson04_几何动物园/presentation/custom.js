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
    const btnExplode = document.getElementById('btn-explode');
    const pigModel = document.getElementById('pig-model');
    const formulaBox = document.getElementById('formula-box');

    if(btnExplode) {
        btnExplode.addEventListener('click', () => {
            pigModel.classList.toggle('exploded');
            formulaBox.classList.toggle('show');
            
            if(pigModel.classList.contains('exploded')) {
                btnExplode.textContent = '🔄 组合还原 (组装)';
                btnExplode.style.background = '#2ed573';
                btnExplode.style.boxShadow = '0 10px 20px rgba(46, 213, 115, 0.3)';
            } else {
                btnExplode.textContent = '✨ 施展透视魔法 (拆解)';
                btnExplode.style.background = '#ff4757';
                btnExplode.style.boxShadow = '0 10px 20px rgba(255, 71, 87, 0.3)';
            }
        });
    }

    // Painting Logic
    const colorBtns = document.querySelectorAll('.color-btn');
    const paintParts = document.querySelectorAll('.paintable-pig .part');
    let currentColor = { bg: '#ffcccc', border: '#ff9999' };

    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentColor = {
                bg: btn.getAttribute('data-bg'),
                border: btn.getAttribute('data-border')
            };
        });
    });

    paintParts.forEach(part => {
        part.addEventListener('click', () => {
            const type = part.getAttribute('data-part');
            
            if (type === 'ear') {
                part.style.borderBottomColor = currentColor.bg;
            } else if (type === 'snout') {
                part.style.backgroundColor = currentColor.bg;
                part.style.borderColor = currentColor.border;
            } else {
                part.style.backgroundColor = currentColor.bg;
            }
            
            // Create a small pop effect
            part.style.transform = 'scale(1.1)';
            setTimeout(() => {
                part.style.transform = '';
            }, 150);
        });
    });
});
