document.addEventListener('DOMContentLoaded', () => {
    // Gravity Demo
    const btnGravity = document.getElementById('btn-gravity');
    const gStand = document.getElementById('g-stand');

    if(btnGravity && gStand) {
        btnGravity.addEventListener('click', () => {
            gStand.classList.toggle('fail');
            if(gStand.classList.contains('fail')) {
                btnGravity.textContent = '🔄 撤销 (拿走手机)';
                btnGravity.style.background = '#34495e';
            } else {
                btnGravity.textContent = '测试重心 (放上手机)';
                btnGravity.style.background = '#e74c3c';
            }
        });
    }

    // Lay Flat Demo
    const btnFlat = document.getElementById('btn-flat');
    const lModel = document.getElementById('l-model');
    const lVisual = document.querySelector('.l-visual');

    if(btnFlat && lModel) {
        btnFlat.addEventListener('click', () => {
            lModel.classList.toggle('is-flat');
            lVisual.classList.toggle('is-flat');
            
            if(lModel.classList.contains('is-flat')) {
                btnFlat.textContent = '🔄 撤销 (回到悬空状态)';
                btnFlat.style.background = '#95a5a6';
            } else {
                btnFlat.textContent = 'F 键：强制熨平鞋底';
                btnFlat.style.background = '#3498db';
            }
        });
    }
});
