document.addEventListener('DOMContentLoaded', () => {
    const btnCut = document.getElementById('btn-cut');
    const sceneCut = document.querySelector('.scene-cut');

    if(btnCut && sceneCut) {
        btnCut.addEventListener('click', () => {
            sceneCut.classList.toggle('is-cut');
            
            if(sceneCut.classList.contains('is-cut')) {
                btnCut.textContent = '🔄 撤销切割 (Undo)';
                btnCut.style.background = '#34495e';
                btnCut.style.boxShadow = '0 10px 20px rgba(52, 73, 94, 0.3)';
            } else {
                btnCut.textContent = '✂️ 一刀两断 (Cut)';
                btnCut.style.background = '#e74c3c';
                btnCut.style.boxShadow = '0 10px 20px rgba(231, 76, 60, 0.3)';
            }
        });
    }
});
