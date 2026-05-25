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
    // Boolean Engrave Demo has been replaced with CSS 3D blocks

    // Infill Slider Demo
    const slider = document.getElementById('infill-slider');
    const valDisplay = document.getElementById('infill-val');
    const infillCube = document.getElementById('cube-infill');

    if (slider && infillCube && valDisplay) {
        // Map 5% - 50% to grid size 100px - 10px
        slider.addEventListener('input', (e) => {
            const percentage = parseInt(e.target.value);
            valDisplay.textContent = percentage;
            
            // At 5%, grid size is 100px (very sparse)
            // At 50%, grid size is 10px (very dense)
            const minSize = 10;
            const maxSize = 100;
            const minPct = 5;
            const maxPct = 50;
            
            // Linear mapping
            const gridSize = maxSize - ((percentage - minPct) / (maxPct - minPct)) * (maxSize - minSize);
            
            infillCube.style.backgroundSize = `${gridSize}px ${gridSize}px`;
        });
        
        // Init
        slider.dispatchEvent(new Event('input'));
    }
});
