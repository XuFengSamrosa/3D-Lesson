document.addEventListener('DOMContentLoaded', () => {
    const stepBtns = document.querySelectorAll('.step-btn');
    const descriptions = document.querySelectorAll('.desc');
    const visualSide = document.querySelector('.visual-side');

    // Make the scene rotate automatically for a better 3D feel
    const scene = document.querySelector('.scene');
    let autoRotate = true;
    let angle = 45;

    function rotateScene() {
        if(autoRotate) {
            angle += 0.5;
            // if step 4, keep the tilt different to see inside
            if(visualSide.classList.contains('step-4')) {
                scene.style.transform = `rotateX(-45deg) rotateY(${angle}deg)`;
            } else {
                scene.style.transform = `rotateX(-20deg) rotateY(${angle}deg)`;
            }
        }
        requestAnimationFrame(rotateScene);
    }
    rotateScene();

    // Pause rotation on hover so users can inspect
    visualSide.addEventListener('mouseenter', () => autoRotate = false);
    visualSide.addEventListener('mouseleave', () => autoRotate = true);

    stepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const step = btn.getAttribute('data-step');
            
            // Update buttons
            stepBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update descriptions
            descriptions.forEach(d => d.classList.remove('show'));
            document.getElementById(`desc-${step}`).classList.add('show');

            // Update 3D Visuals
            visualSide.className = 'visual-side'; // reset classes
            if (step > 0) {
                visualSide.classList.add(`step-${step}`);
            }
        });
    });
});
