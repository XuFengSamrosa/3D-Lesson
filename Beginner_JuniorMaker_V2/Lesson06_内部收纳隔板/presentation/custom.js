document.addEventListener('DOMContentLoaded', () => {
    // Array Demo
    const btnArray = document.getElementById('btn-array');
    const cStack = document.getElementById('c-stack');

    if(btnArray && cStack) {
        btnArray.addEventListener('click', () => {
            cStack.classList.toggle('is-arrayed');
            if(cStack.classList.contains('is-arrayed')) {
                btnArray.textContent = '🔄 撤销 (回到原位重叠)';
                btnArray.style.background = '#e74c3c';
            } else {
                btnArray.textContent = '执行：粘一次，拽一下';
                btnArray.style.background = '#f39c12';
            }
        });
    }

    // Support Demo
    const btnSupport = document.getElementById('btn-support');
    const sVisual = document.getElementById('s-visual');

    if(btnSupport && sVisual) {
        btnSupport.addEventListener('click', () => {
            sVisual.classList.toggle('is-supported');
            if(sVisual.classList.contains('is-supported')) {
                btnSupport.textContent = '✨ 魔法完成！脚手架已生成';
                btnSupport.style.background = '#34495e';
            } else {
                btnSupport.textContent = '施法：长出支撑脚手架！';
                btnSupport.style.background = '#27ae60';
            }
        });
    }
});
