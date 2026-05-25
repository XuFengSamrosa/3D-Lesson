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
    // Expose function for inline HTML onclick handlers
    window.simulateColor = function(type) {
        const timeDisplay = document.getElementById('time-display');
        const wasteDisplay = document.getElementById('waste-display');
        const timeBoard = document.querySelector('.time-board');
        const vLayer = document.querySelector('.v-layer');
        const vVertical = document.querySelector('.v-vertical');

        if(type === 'good') {
            timeBoard.classList.remove('is-bad');
            timeDisplay.textContent = '01:18:00';
            wasteDisplay.textContent = '2 g';
            
            // Just a tiny bump in time and waste
        } else if (type === 'bad') {
            timeBoard.classList.add('is-bad');
            timeDisplay.textContent = '22:45:00';
            wasteDisplay.textContent = '185 g';
            
            // Trigger giant prime tower animation
            vVertical.classList.add('is-active');
        }
    };
});
