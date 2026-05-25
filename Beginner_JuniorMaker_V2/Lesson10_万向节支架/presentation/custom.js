document.addEventListener('DOMContentLoaded', () => {
    // CT Scan Slider Demo
    const slider = document.getElementById('slice-slider');
    const ctShell = document.getElementById('ct-shell');
    const zPlane = document.getElementById('z-plane');

    if(slider && ctShell && zPlane) {
        slider.addEventListener('input', (e) => {
            const val = e.target.value; // 0 to 100
            
            // Adjust the height of the shell being "cut"
            const heightPercent = val;
            ctShell.style.height = (heightPercent * 2) + 'px'; // Max 200px
            
            // Move the Z plane visual
            const zTranslation = (val * 2) - 100;
            zPlane.style.transform = `rotateX(70deg) translateZ(${zTranslation}px)`;
        });
    }

    // Snap Demo
    const btnSnap = document.getElementById('btn-snap');
    const sVisual = document.querySelector('.s-visual');

    if(btnSnap && sVisual) {
        btnSnap.addEventListener('click', () => {
            sVisual.classList.toggle('is-snapped');
            if(sVisual.classList.contains('is-snapped')) {
                btnSnap.textContent = '🔄 换个新零件 (恢复粘连)';
                btnSnap.style.background = '#95a5a6';
                btnSnap.style.boxShadow = 'none';
            } else {
                btnSnap.textContent = '用力掰断粘连丝！';
                btnSnap.style.background = '#e74c3c';
                btnSnap.style.boxShadow = '0 10px 20px rgba(231, 76, 60, 0.3)';
            }
        });
    }
});
