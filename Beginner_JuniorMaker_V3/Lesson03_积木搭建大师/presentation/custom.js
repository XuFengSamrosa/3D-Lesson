document.addEventListener('DOMContentLoaded', () => {
    // 1. Axes Slider Controls Logic
    const sliderX = document.getElementById('slider-x');
    const sliderY = document.getElementById('slider-y');
    const sliderZ = document.getElementById('slider-z');
    const valX = document.getElementById('val-x');
    const valY = document.getElementById('val-y');
    const valZ = document.getElementById('val-z');
    const targetBlock = document.getElementById('target-block');
    const btnReset = document.getElementById('btn-reset');

    if (sliderX && sliderY && sliderZ && valX && valY && valZ && targetBlock && btnReset) {
        function update3DTransform() {
            const x = Number(sliderX.value);
            const y = Number(sliderY.value);
            const z = Number(sliderZ.value);

            valX.textContent = `${x}px`;
            valY.textContent = `${y}px`;
            valZ.textContent = `${z}px`;

            // X moves left/right (CSS X)
            // Y moves depth (CSS Z)
            // Z moves height (CSS -Y)
            targetBlock.style.transform = `rotateX(-20deg) rotateY(45deg) translate3d(${x}px, ${-z}px, ${y}px)`;
        }

        sliderX.addEventListener('input', update3DTransform);
        sliderY.addEventListener('input', update3DTransform);
        sliderZ.addEventListener('input', update3DTransform);

        btnReset.addEventListener('click', () => {
            sliderX.value = 0;
            sliderY.value = 0;
            sliderZ.value = 0;
            update3DTransform();
        });

        // Initialize state
        update3DTransform();
    }

    // 2. Illusion Demo Perspective Rotate Logic
    const btnRotate = document.getElementById('btn-rotate');
    const scene = document.getElementById('illusion-scene');

    if (btnRotate && scene) {
        btnRotate.addEventListener('click', () => {
            scene.classList.toggle('rotated');
            if (scene.classList.contains('rotated')) {
                btnRotate.textContent = '🔄 转回正面看';
            } else {
                btnRotate.textContent = '👀 点击旋转视角，看清真相！';
            }
        });
    }
});
