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
